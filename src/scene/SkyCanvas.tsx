import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { SignId } from "../data/signs";
import type { IntroPhase } from "../hooks/useIntro";
import { signIndex } from "../lib/zodiac";
import CameraRig from "./CameraRig";
import ConstellationRing from "./ConstellationRing";
import IntroSequence from "./intro/IntroSequence";

interface Props {
  activeId: SignId;
  todayId: SignId;
  introPhase: IntroPhase;
  onIntroReady: () => void;
  onIntroCleared: () => void;
  onSelect: (id: SignId) => void;
  onOpenGate: (origin: { x: number; y: number }) => void;
  className?: string;
}

/**
 * One canvas for the whole visit. The nebula is a CSS background behind it, so the GPU only
 * draws stars and lines; dpr is capped so high-density phones don't render 9× the pixels.
 */
export default function SkyCanvas(props: Props) {
  const { activeId, todayId, introPhase, onIntroReady, onIntroCleared, onSelect, onOpenGate, className } = props;
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 12], fov: 45, near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <CameraRig focusKey={activeId} enabled={introPhase === "done"} />
      <Suspense fallback={null}>
        {introPhase !== "done" && (
          <IntroSequence
            phase={introPhase}
            todayIndex={signIndex(todayId)}
            onReady={onIntroReady}
            onCleared={onIntroCleared}
          />
        )}
        <ConstellationRing
          activeId={activeId}
          revealed={introPhase === "done"}
          onSelect={onSelect}
          onOpenGate={onOpenGate}
        />
      </Suspense>
    </Canvas>
  );
}
