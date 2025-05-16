import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import { ARC_POSITIONS } from "../data/layout";
import { CONSTELLATIONS } from "../data/zodiac";
import ZodiacConstellation from "./ZodiacConstellation";

interface Props {
  active: string;
  skipIntro?: boolean;
}

export default function ZodiacScene({ active, skipIntro = false }: Props) {
  const positions = useMemo(() => ARC_POSITIONS(), []);

  /* 1️⃣  figure out which index is active */
  const activeIdx = Object.keys(CONSTELLATIONS).indexOf(active);

  /* 2️⃣  spring that rotates the whole ring on Y axis */
  const { rotY } = useSpring({
    rotY: skipIntro ? -((activeIdx - 5.5) / 11) * Math.PI : 0, // start at final position if skipping intro
    config: { mass: 4, tension: 120, friction: 26 },
  });

  /* 3️⃣  ambient drift on Z axis (same as before) */
  useFrame((state, delta) => {
    if (!skipIntro) {
      state.scene.rotation.z += delta * 0.01;
    }
  });

  return (
    <a.group position-x={-2.5} rotation-y={rotY}>
      {Object.keys(CONSTELLATIONS).map((name, idx) => {
        const stars = CONSTELLATIONS[name];
        const [x, y, z] = positions[idx];

        const isActive = name === active;
        const scale = isActive ? 1.8 : 0.9;
        const opacity = isActive ? 1 : 0.2;

        return (
          <group key={name} position={[x, y, z]} scale={scale}>
            <ZodiacConstellation
              stars={stars}
              starOpacity={opacity}
              lineProps={{ transparent: true, opacity }}
              name={name}
              isActive={isActive}
            />
          </group>
        );
      })}
    </a.group>
  );
}
