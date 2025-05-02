import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";

export default function DustField({ onCleared }: { onCleared: () => void }) {
  const ref = useRef<THREE.Points>(null!);
  // generate points on a disc
  const positions = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 5000; i++) {
      const r = Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      arr.push(
        r * Math.cos(theta),
        r * Math.sin(theta),
        -4 + Math.random() * 0.2
      );
    }
    return new Float32Array(arr);
  }, []);

  // interactivity – push points away from cursor
  const clearedRef = useRef(0);
  useGesture(
    {
      onMove: ({ xy: [mx, my], event }) => {
        const { width, height } = (
          event.target as HTMLCanvasElement
        ).getBoundingClientRect();
        const xN = (mx / width) * 2 - 1;
        const yN = -(my / height) * 2 + 1;
        const cursor = new Vector3(xN * 5, yN * 3, -4);
        const positions = ref.current.geometry.attributes.position;
        let cleared = 0;
        for (let i = 0; i < positions.count; i++) {
          const vx = positions.getX(i);
          const vy = positions.getY(i);
          const vz = positions.getZ(i);
          const dist = cursor.distanceTo({ x: vx, y: vy, z: vz } as Vector3);
          if (dist < 0.8) {
            positions.setXYZ(i, vx * 1.05, vy * 1.05, vz);
          }
          if (Math.hypot(vx, vy) > 2.5) cleared++;
        }
        positions.needsUpdate = true;
        const pct = (cleared / positions.count) * 100;
        if (pct > 50 && clearedRef.current === 0) {
          clearedRef.current = 1;
          onCleared();
        }
      },
    },
    { target: window }
  );

  // slight drift
  useFrame(() => {
    ref.current.rotation.z += 0.0004;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial size={0.025} transparent color="#ffffff" />
    </Points>
  );
}
