import { useMemo, useRef, useState, type MutableRefObject } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Line, useCursor, useTexture } from "@react-three/drei";
import { AdditiveBlending, MathUtils, type Group, type Sprite, type SpriteMaterial } from "three";
import type { Line2, LineSegments2 } from "three-stdlib";
import type { ConstellationFigure } from "../data/constellations";
import { projectStars, starSize } from "../lib/sky";

export const FIGURE_SIZE = 3;
const ACTIVE_SCALE = 1.5;
const IDLE_SCALE = 0.8;

interface Props {
  figure: ConstellationFigure;
  active: boolean;
  /** 0 while the intro is running, easing to 1 once the sky is revealed. */
  reveal: MutableRefObject<number>;
  /** Tapped: picks an idle constellation, or opens the tarot gate from the active one. */
  onSelect?: (origin: { x: number; y: number }) => void;
}

export default function Constellation({ figure, active, reveal, onSelect }: Props) {
  const texture = useTexture("/assets/star.png");
  const points = useMemo(() => projectStars(figure.stars, FIGURE_SIZE), [figure]);
  const segments = useMemo(() => figure.edges.flatMap(([a, b]) => [points[a], points[b]]), [figure, points]);
  const sizes = useMemo(() => figure.stars.map((s) => starSize(s.mag)), [figure]);

  const group = useRef<Group>(null!);
  const line = useRef<Line2 | LineSegments2>(null!);
  const sprites = useRef<Sprite[]>([]);
  const emphasis = useRef(active ? 1 : 0);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(({ clock }, dt) => {
    const target = active ? 1 : hovered ? 0.35 : 0;
    const e = (emphasis.current = MathUtils.damp(emphasis.current, target, 5, dt));
    const r = reveal.current;
    const t = clock.elapsedTime;

    group.current.scale.setScalar(MathUtils.lerp(IDLE_SCALE, ACTIVE_SCALE, Math.min(e, 1)));
    line.current.material.opacity = MathUtils.lerp(0.1, 0.7, e) * r;
    sprites.current.forEach((sprite, i) => {
      (sprite.material as SpriteMaterial).opacity = MathUtils.lerp(0.35, 1, e) * r;
      // A slow, shallow twinkle so the sky stays calm behind the reading text.
      sprite.scale.setScalar(sizes[i] * (1 + 0.06 * Math.sin(t * (0.65 + (i % 5) * 0.15) + i * 2.1)));
    });
  });

  const click = (e: ThreeEvent<MouseEvent>) => {
    // Ignore the click that ends a drag.
    if (e.delta > 6) return;
    e.stopPropagation();
    onSelect?.({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
  };

  return (
    <group ref={group}>
      <Line ref={line} points={segments} segments color="#d6e4ff" lineWidth={1.2} transparent depthWrite={false} />
      {points.map((p, i) => (
        <sprite key={figure.stars[i].name} ref={(el) => el && (sprites.current[i] = el)} position={p}>
          <spriteMaterial map={texture} transparent depthWrite={false} blending={AdditiveBlending} />
        </sprite>
      ))}
      {/* Invisible hit area so the whole figure is easy to tap, not just the 1px lines. */}
      <mesh
        onClick={click}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[FIGURE_SIZE * 1.1, FIGURE_SIZE * 1.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
