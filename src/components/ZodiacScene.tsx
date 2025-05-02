import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three"; // ← NEW
import { ARC_POSITIONS } from "../data/layout";
import { CONSTELLATIONS } from "../data/zodiac";
import ZodiacConstellation from "./ZodiacConstellation";

interface Props {
  active: string;
}

export default function ZodiacScene({ active }: Props) {
  const positions = useMemo(() => ARC_POSITIONS(), []);

  /* 1️⃣  figure out which index is active */
  const activeIdx = Object.keys(CONSTELLATIONS).indexOf(active);

  /* 2️⃣  spring that rotates the whole ring on Y axis */
  const { rotY } = useSpring({
    rotY: -((activeIdx - 5.5) / 11) * Math.PI, // maps index → angle
    config: { mass: 4, tension: 120, friction: 26 },
  });

  /* 3️⃣  ambient drift on Z axis (same as before) */
  useFrame((state, delta) => {
    state.scene.rotation.z += delta * 0.01;
  });

  return (
    <a.group position-x={-2.5 /* shift left */} rotation-y={rotY}>
      {Object.keys(CONSTELLATIONS).map((name, idx) => {
        const stars = CONSTELLATIONS[name];
        const [x, y, z] = positions[idx];

        const isActive = name === active;
        const scale = isActive ? 1.8 : 0.9; // was 2.8 / 1.4

        const opacity = isActive ? 1 : 0.2;

        return (
          <group key={name} position={[x, y, z]} scale={scale}>
            <ZodiacConstellation
              stars={stars}
              starOpacity={opacity}
              lineProps={{ transparent: true, opacity }}
            />
          </group>
        );
      })}
    </a.group>
  );
}
