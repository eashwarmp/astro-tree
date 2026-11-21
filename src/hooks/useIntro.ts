import { useCallback, useEffect, useState } from "react";
import { local, prefersReducedMotion } from "../lib/env";

export type IntroPhase = "wheel" | "dust" | "leaving" | "done";

const SEEN_KEY = "astro-tree:intro-seen-on";
const todayKey = () => new Date().toDateString();
const WHEEL_MS = 3600;
const DUST_MAX_MS = 14000;
const LEAVE_MS = 900;
/** If the scene still hasn't loaded by now (slow network, weak GPU), skip straight to the sky. */
const LOAD_TIMEOUT_MS = 8000;

/** Runs the intro once a day, like a morning ritual: wheel → dust → leaving → done. */
export function useIntro(skip: boolean) {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    skip || local.get(SEEN_KEY) === todayKey() || prefersReducedMotion() ? "done" : "wheel",
  );

  // The wheel's clock only starts once its texture is on screen, so slow devices still see it spin.
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (phase === "wheel" && !ready) {
      const t = setTimeout(() => setPhase("done"), LOAD_TIMEOUT_MS);
      return () => clearTimeout(t);
    }
    const next: Partial<Record<IntroPhase, [IntroPhase, number]>> = {
      wheel: ["dust", WHEEL_MS],
      dust: ["leaving", DUST_MAX_MS],
      leaving: ["done", LEAVE_MS],
    };
    const step = next[phase];
    if (!step) {
      local.set(SEEN_KEY, todayKey());
      return;
    }
    const t = setTimeout(() => setPhase(step[0]), step[1]);
    return () => clearTimeout(t);
  }, [phase, ready]);

  const finish = useCallback(() => setPhase((p) => (p === "wheel" || p === "dust" ? "leaving" : p)), []);

  return { phase, finish, markReady };
}
