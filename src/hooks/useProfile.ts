import { useCallback, useSyncExternalStore } from "react";
import type { SignId } from "../data/signs";
import { local } from "../lib/env";
import type { ReadingOptions } from "../lib/horoscope";
import { signById } from "../lib/zodiac";

/** What the reader tells us about themselves. Stored only on this device. */
export interface Profile {
  sign: SignId;
  name?: string;
  /** Month 1–12 and day; the year isn't needed for anything the app does. */
  birthday?: { month: number; day: number };
  rising?: SignId;
}

const KEY = "astro-tree:profile";
const DISMISSED_KEY = "astro-tree:welcome-dismissed";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => (listeners.add(l), () => void listeners.delete(l));

let cachedRaw: string | null = null;
let cached: Profile | null = null;
function read(): Profile | null {
  const raw = local.get(KEY);
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const p = raw ? (JSON.parse(raw) as Profile) : null;
    cached = p && signById(p.sign) ? p : null;
  } catch {
    cached = null;
  }
  return cached;
}

export function useProfile() {
  const profile = useSyncExternalStore(subscribe, read);
  const dismissed = useSyncExternalStore(subscribe, () => local.get(DISMISSED_KEY) === "1");

  const save = useCallback((p: Profile | null) => {
    local.set(KEY, p ? JSON.stringify(p) : null);
    notify();
  }, []);
  const dismiss = useCallback(() => {
    local.set(DISMISSED_KEY, "1");
    notify();
  }, []);

  return { profile, save, dismissed, dismiss };
}

/** Reading options for `signId`: personalised only when it's the reader's own sign. */
export function readingOptions(profile: Profile | null, signId: SignId): ReadingOptions {
  if (!profile || profile.sign !== signId) return {};
  return { housesFrom: profile.rising, birthday: profile.birthday };
}
