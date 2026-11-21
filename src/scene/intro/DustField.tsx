import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type BufferAttribute, type Points, type PointsMaterial } from "three";

const COUNT = 4000;
const MAX_DISC_RADIUS = 3;
const BRUSH_RADIUS = 0.9;
/** The sky counts as revealed once the middle of the cloud holds this share of its starting dust. */
const CORE_FRACTION = 0.6;
const CLEARED_WHEN_CORE_BELOW = 0.3;
/** After this long the dust starts drifting apart on its own, for people who just watch. */
const SELF_CLEAR_AFTER = 6;

interface Props {
  /** True once the dust should blow away and fade out. */
  leaving: boolean;
  onCleared: () => void;
}

/** A cloud of stardust that the pointer (mouse or finger) brushes aside to reveal the sky. */
export default function DustField({ leaving, onCleared }: Props) {
  const points = useRef<Points>(null!);
  const lastPointer = useRef<[number, number] | null>(null);
  const started = useRef<number | null>(null);
  const done = useRef(false);
  // Fit the cloud to the screen so phones in portrait can clear it too. Sized once; resizing
  // mid-intro shouldn't reshuffle the dust.
  const viewport = useThree((s) => s.viewport);
  const [radius] = useState(() => Math.min(MAX_DISC_RADIUS, viewport.width * 0.45, viewport.height * 0.45));
  const core = radius * CORE_FRACTION;

  const { positions, velocity, coreStart } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    let coreStart = 0;
    for (let i = 0; i < COUNT; i++) {
      // Denser towards the middle, like a cloud.
      const r = Math.pow(Math.random(), 0.8) * radius;
      const a = Math.random() * Math.PI * 2;
      positions.set([r * Math.cos(a), r * Math.sin(a), (Math.random() - 0.5) * 0.3], i * 3);
      if (r < core) coreStart++;
    }
    return { positions, velocity: new Float32Array(COUNT * 2), coreStart };
  }, [radius, core]);

  useFrame(({ pointer, viewport, clock }, delta) => {
    started.current ??= clock.elapsedTime;
    const elapsed = clock.elapsedTime - started.current;
    // Normalise to 60 fps steps so 120 Hz screens and slow phones feel the same.
    const step = Math.min(delta * 60, 3);
    const attr = points.current.geometry.attributes.position as BufferAttribute;
    const p = attr.array as Float32Array;
    const material = points.current.material as PointsMaterial;

    const moved =
      lastPointer.current !== null && (pointer.x !== lastPointer.current[0] || pointer.y !== lastPointer.current[1]);
    lastPointer.current = [pointer.x, pointer.y];
    const cx = (pointer.x * viewport.width) / 2;
    const cy = (pointer.y * viewport.height) / 2;
    const drift = leaving ? 0.08 : Math.max(0, elapsed - SELF_CLEAR_AFTER) * 0.002;
    const friction = Math.pow(0.93, step);

    let inCore = 0;
    for (let i = 0, j = 0; i < p.length; i += 3, j += 2) {
      const x = p[i];
      const y = p[i + 1];
      const r = Math.hypot(x, y) || 1;
      let vx = velocity[j] * friction + (x / r) * drift * step;
      let vy = velocity[j + 1] * friction + (y / r) * drift * step;
      if (moved && !leaving) {
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy);
        if (d < BRUSH_RADIUS) {
          // Flick away from the brush, with an outward bias so the middle empties.
          const push = (1 - d / BRUSH_RADIUS) * 0.05;
          vx += (dx / (d || 1)) * push + (x / r) * push;
          vy += (dy / (d || 1)) * push + (y / r) * push;
        }
      }
      velocity[j] = vx;
      velocity[j + 1] = vy;
      p[i] = x + vx * step;
      p[i + 1] = y + vy * step;
      if (p[i] * p[i] + p[i + 1] * p[i + 1] < core * core) inCore++;
    }
    attr.needsUpdate = true;

    material.opacity = MathUtils.damp(material.opacity, leaving ? 0 : 0.9, leaving ? 4 : 2, delta);
    if (!done.current && inCore < coreStart * CLEARED_WHEN_CORE_BELOW) {
      done.current = true;
      onCleared();
    }
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#f6ecd6" transparent opacity={0} depthWrite={false} sizeAttenuation />
    </points>
  );
}
