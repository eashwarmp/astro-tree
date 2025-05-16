// ─ IntroScene.tsx ─
import { Canvas } from "@react-three/fiber";
import {  useEffect, useState } from "react";
import { useSpring } from "@react-spring/three";
import ZodiacWheel from "./ZodiacWheel";
import DustField from "./DustField";
import NebulaEnvironment from "./NebulaEnvironment";

export default function IntroScene({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"fade" | "wheel" | "dust">("wheel");
  const [showDust, setShowDust] = useState(false);

  useEffect(() => {
    if (phase === "wheel") {
      const timeout = setTimeout(() => {
        setPhase("dust");
        setShowDust(true);
      }, 3000); // 3 seconds
      return () => clearTimeout(timeout);
    }

    if (phase === "dust") {
      const t = setTimeout(onDone, 1000); // fade out dust
      return () => clearTimeout(t);
    }
  }, [phase]);


  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      {/* ① add a simple light so materials are visible */}
      <ambientLight intensity={1} />
      <NebulaEnvironment />
      {/* ── Phase B · spinning wheel ── */}
      {phase === "wheel" && <ZodiacWheel />}
      {/* ── Phase C · interactive dust ── */}
      {showDust && (
        <DustField
          onCleared={() => {
            onDone(); // notify App: intro finished
          }}
        />
      )}
    </Canvas>
  );
}
