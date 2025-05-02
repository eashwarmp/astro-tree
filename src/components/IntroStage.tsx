import { useState, useEffect } from "react";
import { a, useSpring } from "@react-spring/three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

import DustField from "./DustField";
import { getTodayIndex } from "./utils";

export default function IntroStage({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"wheel" | "dust">("wheel");

  /* load wheel texture once */
  const wheelTex = useLoader(TextureLoader, "/assets/wheel.png");

  /* wheel spins automatically for 3 s, then switch to dust phase */
  const { rotation } = useSpring({
    from: { rotation: 0 },
    to: {
      rotation: -Math.PI * 2 - (getTodayIndex() / 12) * Math.PI * 2,
    },
    config: { duration: 3000 },
    onRest: () => setPhase("dust"),
  });

  /* auto‑clear dust after 2 s if user doesn’t interact */
  useEffect(() => {
    if (phase === "dust") {
      const t = setTimeout(onDone, 2000);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <>
      {phase === "wheel" && (
        <a.mesh rotation-z={rotation} position={[0, 0, -5]}>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial
            map={wheelTex}
            transparent
            alphaTest={0.05} /* hides square bg if still present */
            emissive="#ffffff"
            emissiveIntensity={1}
          />
        </a.mesh>
      )}

      {phase === "dust" && <DustField onCleared={onDone} />}
    </>
  );
}
