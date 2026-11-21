import { useCallback, useMemo, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import type { Sign, SignId } from "../data/signs";
import { useActiveSign } from "../hooks/useActiveSign";
import { useIntro } from "../hooks/useIntro";
import { useToday } from "../hooks/useToday";
import { hasWebGL } from "../lib/env";
import { sunSign } from "../lib/zodiac";
import SceneBoundary from "../scene/SceneBoundary";
import SkyCanvas from "../scene/SkyCanvas";
import IntroHint from "../ui/IntroHint";
import styles from "./SkyLayout.module.css";

export interface GateOptions {
  origin?: { x: number; y: number };
  spread?: "daily" | "timeline" | "guidance";
}

export interface SkyOutletContext {
  sign: Sign;
  select: (id: SignId) => void;
  /** Opens the tarot gate, expanding from `origin` (e.g. the tapped constellation) and optionally straight into a spread. */
  openGate: (options?: GateOptions) => void;
}

/**
 * The persistent shell: nebula backdrop, one WebGL canvas for the whole visit, and the
 * routed HTML (sign panel or tarot card) on top. Keeping the canvas here means switching
 * routes never tears down the GPU context or reloads textures.
 */
export default function SkyLayout() {
  const sign = useActiveSign();
  const navigate = useNavigate();
  const onIndex = useMatch("/") !== null;
  const [webgl, setWebgl] = useState(hasWebGL);
  const date = useToday();
  const today = useMemo(() => sunSign(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)), [date]);
  // The intro only greets people landing on the sky, not deep links to a card or the gate.
  const intro = useIntro(!onIndex || !webgl);
  const introRunning = intro.phase !== "done";

  const select = useCallback((id: SignId) => navigate(`/?sign=${id}`, { replace: true }), [navigate]);
  const canBrowse = !introRunning && onIndex;
  const openGate = useCallback(
    (options?: GateOptions) => navigate(`/tarot/${sign.id}`, { state: options }),
    [navigate, sign.id],
  );

  return (
    <div className={styles.root}>
      {webgl && (
        <SceneBoundary
          onError={() => {
            setWebgl(false);
            intro.finish();
          }}
        >
          <div className={styles.sky}>
            <SkyCanvas
              activeId={sign.id}
              todayId={today.id}
              introPhase={intro.phase}
              onIntroReady={intro.markReady}
              onIntroCleared={intro.finish}
              onSelect={canBrowse ? select : noop}
              onOpenGate={canBrowse ? (origin) => openGate({ origin }) : noop}
            />
          </div>
        </SceneBoundary>
      )}
      {introRunning ? (
        <IntroHint phase={intro.phase} today={today} onSkip={intro.finish} />
      ) : (
        <Outlet context={{ sign, select, openGate } satisfies SkyOutletContext} />
      )}
    </div>
  );
}

function noop() {}
