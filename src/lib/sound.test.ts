import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type SoundModule = typeof import("./sound");

function memoryStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    store,
  };
}

// The preference is cached at module level, so each test loads a fresh copy.
async function load(): Promise<SoundModule["sound"]> {
  vi.resetModules();
  return (await import("./sound")).sound;
}

describe("sound preference", () => {
  beforeEach(() => vi.unstubAllGlobals());
  afterEach(() => vi.unstubAllGlobals());

  it("is off by default", async () => {
    vi.stubGlobal("localStorage", memoryStorage());
    expect((await load()).isOn()).toBe(false);
  });

  it("restores a saved choice", async () => {
    vi.stubGlobal("localStorage", memoryStorage({ "astro-tree:sound": "on" }));
    expect((await load()).isOn()).toBe(true);
  });

  it("treats anything but 'on' as off", async () => {
    vi.stubGlobal("localStorage", memoryStorage({ "astro-tree:sound": "yes" }));
    expect((await load()).isOn()).toBe(false);
  });

  it("persists changes and notifies subscribers until they unsubscribe", async () => {
    const storage = memoryStorage();
    vi.stubGlobal("localStorage", storage);
    const sound = await load();
    const listener = vi.fn();
    const unsubscribe = sound.subscribe(listener);

    sound.setOn(true);
    expect(sound.isOn()).toBe(true);
    expect(storage.store.get("astro-tree:sound")).toBe("on");
    expect(listener).toHaveBeenCalledTimes(1);

    sound.setOn(true);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    sound.setOn(false);
    expect(storage.store.get("astro-tree:sound")).toBe("off");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("still works in memory when storage throws", async () => {
    const boom = () => {
      throw new Error("blocked");
    };
    vi.stubGlobal("localStorage", { getItem: boom, setItem: boom, removeItem: boom });
    const sound = await load();
    expect(sound.isOn()).toBe(false);
    sound.setOn(true);
    expect(sound.isOn()).toBe(true);
  });

  it("makes every sound a no-op without Web Audio", async () => {
    vi.stubGlobal("localStorage", memoryStorage({ "astro-tree:sound": "on" }));
    const sound = await load();
    expect(() => {
      sound.unlock();
      sound.bowl();
      sound.swell();
      sound.riffleStart();
      sound.riffleStop();
      sound.tick();
      sound.chime();
    }).not.toThrow();
  });
});
