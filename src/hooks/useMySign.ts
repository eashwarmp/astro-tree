import { useCallback, useSyncExternalStore } from "react";
import type { SignId } from "../data/signs";
import { local } from "../lib/env";
import { signById } from "../lib/zodiac";

const KEY = "astro-tree:my-sign";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The reader's own sign, remembered on this device; the sky opens on it by default. */
export function useMySign(): [SignId | null, (id: SignId | null) => void] {
  const mine = useSyncExternalStore(subscribe, () => signById(local.get(KEY))?.id ?? null);
  const set = useCallback((id: SignId | null) => {
    local.set(KEY, id);
    listeners.forEach((l) => l());
  }, []);
  return [mine, set];
}
