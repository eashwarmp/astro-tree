import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Mesh, type MeshBasicMaterial } from "three";
import { useKeyedTexture } from "./useKeyedTexture";

const SPIN_SECONDS = 2.6;

interface Props {
  /** Index of the sign to stop on; the artwork has Aries at 12 o'clock, running clockwise. */
  landOn: number;
  visible: boolean;
  /** Called once the artwork has loaded and the spin begins. */
  onReady: () => void;
}

/** Spins once and a bit, easing out so today's sign comes to rest at the top. */
export default function ZodiacWheel({ landOn, visible, onReady }: Props) {
  const texture = useKeyedTexture("/assets/wheel.png");
  const mesh = useRef<Mesh>(null!);
  const started = useRef<number | null>(null);
  const { viewport } = useThree();
  const size = Math.min(6, viewport.width * 0.85, viewport.height * 0.7);
  const finalAngle = Math.PI * 2 + (landOn * Math.PI) / 6;

  // Runs after the texture suspense resolves, i.e. when the wheel can actually be seen.
  useEffect(onReady, [onReady]);

  useFrame(({ clock }, dt) => {
    started.current ??= clock.elapsedTime;
    const t = Math.min((clock.elapsedTime - started.current) / SPIN_SECONDS, 1);
    mesh.current.rotation.z = finalAngle * (1 - Math.pow(1 - t, 3));
    const material = mesh.current.material as MeshBasicMaterial;
    material.opacity = MathUtils.damp(material.opacity, visible ? 1 : 0, visible ? 3 : 6, dt);
    mesh.current.scale.setScalar(MathUtils.damp(mesh.current.scale.x, visible ? 1 : 1.25, 3, dt));
  });

  return (
    <mesh ref={mesh} position-z={-1}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
