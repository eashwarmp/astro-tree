import { useCallback, useMemo, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import type { Sign, SignId } from "../data/signs";
import { useActiveSign } from "../hooks/useActiveSign";
import { useIntro } from "../hooks/useIntro";
import { setPanelTab } from "../hooks/usePanelTab";
import { useProfile } from "../hooks/useProfile";
import { useToday } from "../hooks/useToday";
import { hasWebGL } from "../lib/env";
import { elongation, moonLongitude, moonPhase, signOfLongitude } from "../lib/ephemeris";
import { sunSign } from "../lib/zodiac";
import SceneBoundary from "../scene/SceneBoundary";
import SkyCanvas from "../scene/SkyCanvas";
import IntroHint from "../ui/IntroHint";
import SoundToggle from "../ui/SoundToggle";
import WelcomeDialog from "../ui/WelcomeDialog";
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
 * routed HTML (sign panel, tarot card or tarot gate) on top. Keeping the canvas here means
 * switching routes never tears down the GPU context or reloads textures.
 */
export default function SkyLayout() {
  const sign = useActiveSign();
  const navigate = useNavigate();
  const onIndex = useMatch("/") !== null;
  const [webgl, setWebgl] = useState(hasWebGL);
  const date = useToday();
  const noon = useMemo(() => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12), [date]);
  const today = useMemo(() => sunSign(noon), [noon]);
  const moon = useMemo(
    () => ({
      sign: signOfLongitude(moonLongitude(noon)),
      illumination: moonPhase(noon).illumination,
      waxing: elongation(noon) < 180,
    }),
    [noon],
  );
  // The intro only greets people landing on the sky, not deep links to a card or the gate.
  const intro = useIntro(!onIndex || !webgl);
  const introRunning = intro.phase !== "done";
  const { profile, save, dismissed, dismiss } = useProfile();
  const [editingProfile, setEditingProfile] = useState(false);
  const showWelcome = editingProfile || (!profile && !dismissed && !introRunning && onIndex);

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
              mySign={profile?.sign}
              moon={moon}
              onMoonTap={() => {
                setPanelTab("today");
                select(moon.sign);
              }}
            />
          </div>
        </SceneBoundary>
      )}

      {introRunning ? (
        <IntroHint phase={intro.phase} today={today} profile={profile} moonSign={moon.sign} onSkip={intro.finish} />
      ) : (
        <Outlet context={{ sign, select, openGate } satisfies SkyOutletContext} />
      )}

      {!introRunning && onIndex && (
        <div className={styles.corner}>
          <button type="button" className={styles.profile} onClick={() => setEditingProfile(true)} aria-label="Your sky">
            <span aria-hidden="true">✧</span> {profile?.name ?? "You"}
          </button>
          <SoundToggle />
        </div>
      )}

      <AnimatePresence>
        {showWelcome && (
          <WelcomeDialog
            initial={profile}
            onSave={(p) => {
              save(p);
              setEditingProfile(false);
              if (onIndex) select(p.sign);
            }}
            onClose={() => {
              if (!profile) dismiss();
              setEditingProfile(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function noop() {}
