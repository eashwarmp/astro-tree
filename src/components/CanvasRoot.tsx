// ── CanvasRoot.tsx ──
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import IntroStage from "../components/IntroStage";
import ZodiacScene from "./ZodiacScene";

export default function CanvasRoot({
  introDone,
  onIntroDone,
  activeSign,
}: {
  introDone: boolean;
  onIntroDone: () => void;
  activeSign: string;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
      <Suspense fallback={null}>
        <Environment files="/textures/nebula/nebula.jpg" background />
        <ambientLight intensity={1} />

        {!introDone && <IntroStage onDone={onIntroDone} />}
        {introDone && <ZodiacScene active={activeSign} />}
      </Suspense>
    </Canvas>
  );
}
