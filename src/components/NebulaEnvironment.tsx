// components/NebulaEnvironment.tsx
import { useEnvironment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function NebulaEnvironment() {
  /* 1. Drei’s helper actually gives us the texture */
  const nebulaTex = useEnvironment({ files: "/assets/nebula.jpg" });

  /* 2. Grab the current three.js scene */
  const { scene } = useThree();

  /* 3. Side‑effect: once the texture is ready, lock it in */
  useEffect(() => {
    if (!nebulaTex) return;

    // Both so that PBR materials can reflect it *and* we see it as BG
    scene.environment = nebulaTex;
    scene.background = nebulaTex;
  }, [nebulaTex, scene]);

  return null; // nothing to render in the JSX tree
}
