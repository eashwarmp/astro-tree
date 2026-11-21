import { useCallback, useMemo, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import type { Sign, SignId } from "../data/signs";
import { useActiveSign } from "../hooks/useActiveSign";
import { useIntro } from "../hooks/useIntro";
import { hasWebGL } from "../lib/env";
import { signForDate } from "../lib/zodiac";
import SceneBoundary from "../scene/SceneBoundary";
import SkyCanvas from "../scene/SkyCanvas";
import IntroHint from "../ui/IntroHint";
import styles from "./SkyLayout.module.css";

export interface SkyOutletContext {
  sign: Sign;
  select: (id: SignId) => void;
}

/**
 * The persistent shell: nebula backdrop, one WebGL canvas for the whole visit, and the
 * routed HTML (sign panel or tarot card) on top. Keeping the canvas here means switching
 * routes never tears down the GPU context or reloads textures.
 */
export default function SkyLayout() {
  const sign = useActiveSign();
  const navigate = useNavigate();
  const onCard = useMatch("/card/:sign") !== null;
  const [webgl, setWebgl] = useState(hasWebGL);
  const today = useMemo(() => signForDate(new Date()), []);
  const intro = useIntro(onCard || !webgl);
  const introRunning = intro.phase !== "done";

  const select = useCallback((id: SignId) => navigate(`/?sign=${id}`, { replace: true }), [navigate]);
  const canBrowse = !introRunning && !onCard;

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
            />
          </div>
        </SceneBoundary>
      )}
      {introRunning ? (
        <IntroHint phase={intro.phase} today={today} onSkip={intro.finish} />
      ) : (
        <Outlet context={{ sign, select } satisfies SkyOutletContext} />
      )}
    </div>
  );
}

function noop() {}
