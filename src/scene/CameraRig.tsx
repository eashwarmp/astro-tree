import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const HOME = new Vector3(0, 0, 12);
const ORIGIN = new Vector3(0, 0, 0);

interface Props {
  /** Changing this glides the camera back home so the newly chosen sign is front and centre. */
  focusKey: string;
  enabled: boolean;
}

/** Drag to orbit, scroll or pinch to zoom; recentres whenever the active sign changes. */
export default function CameraRig({ focusKey, enabled }: Props) {
  const controls = useRef<OrbitControlsImpl>(null);
  const returning = useRef(false);

  useEffect(() => {
    returning.current = true;
  }, [focusKey]);

  useFrame(({ camera }, dt) => {
    const c = controls.current;
    if (!returning.current || !c) return;
    const k = 1 - Math.exp(-3 * dt);
    camera.position.lerp(HOME, k);
    c.target.lerp(ORIGIN, k);
    c.update();
    if (camera.position.distanceTo(HOME) < 0.01 && c.target.length() < 0.01) returning.current = false;
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={enabled}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.7}
      minDistance={5}
      maxDistance={22}
      // Grabbing the sky hands control back to the user mid-glide.
      onStart={() => (returning.current = false)}
    />
  );
}
