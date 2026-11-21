import { useCallback, useEffect, useState } from "react";
import { prefersReducedMotion } from "../lib/env";

export type IntroPhase = "wheel" | "dust" | "leaving" | "done";

const WHEEL_MS = 3600;
const DUST_MAX_MS = 14000;
const LEAVE_MS = 900;
/** If the scene still hasn't loaded by now (slow network, weak GPU), skip straight to the sky. */
const LOAD_TIMEOUT_MS = 8000;

/**
 * Runs the intro (wheel → dust → leaving → done) every time someone lands on the sky. It lives
 * in the persistent layout, so coming back from a card or the tarot gate doesn't replay it.
 * Skipped for deep links, reduced-motion users, and `?intro=off` (handy for testing).
 */
export function useIntro(skip: boolean) {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    skip || prefersReducedMotion() || new URLSearchParams(location.search).get("intro") === "off" ? "done" : "wheel",
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
    if (!step) return;
    const t = setTimeout(() => setPhase(step[0]), step[1]);
    return () => clearTimeout(t);
  }, [phase, ready]);

  const finish = useCallback(() => setPhase((p) => (p === "wheel" || p === "dust" ? "leaving" : p)), []);

  return { phase, finish, markReady };
}
