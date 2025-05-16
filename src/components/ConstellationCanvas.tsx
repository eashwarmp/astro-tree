import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ZodiacScene from "./ZodiacScene";
import NebulaEnvironment from "./NebulaEnvironment";

export default function ConstellationCanvas({ active }: { active: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
      <NebulaEnvironment /> {/* ← permanent BG / environment */}
      <ZodiacScene active={active} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
