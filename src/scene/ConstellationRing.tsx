import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { CONSTELLATIONS } from "../data/constellations";
import { SIGNS, type SignId } from "../data/signs";
import { freeSkyArea } from "../lib/layout";
import { signIndex } from "../lib/zodiac";
import Constellation, { FIGURE_SIZE } from "./Constellation";
import MoonMarker from "./MoonMarker";

const RADIUS = 9;
const STEP = (Math.PI * 2) / SIGNS.length;

interface Props {
  activeId: SignId;
  revealed: boolean;
  onSelect: (id: SignId) => void;
  onOpenGate: (origin: { x: number; y: number }) => void;
  mySign?: SignId | null;
  moon?: { sign: SignId; illumination: number; waxing: boolean };
  onMoonTap?: () => void;
}

/**
 * The twelve constellations on a carousel. The ring turns so the active sign faces the
 * camera, centred in whatever part of the screen the HTML panels leave free.
 */
export default function ConstellationRing({ activeId, revealed, onSelect, onOpenGate, mySign, moon, onMoonTap }: Props) {
  const ring = useRef<Group>(null!);
  const anchor = useRef<Group>(null!);
  const reveal = useRef(0);
  const { size, viewport } = useThree();

  // Track the rotation as a running total so Pisces → Aries turns one step, not eleven back.
  const target = useRef<number | null>(null);
  const goal = -signIndex(activeId) * STEP;
  if (target.current === null) target.current = goal;
  const delta = MathUtils.euclideanModulo(goal - target.current + Math.PI, Math.PI * 2) - Math.PI;
  target.current += delta;

  const placement = useMemo(() => {
    const area = freeSkyArea(size.width, size.height);
    // viewport is measured at the ring's front (z = 0), where the active figure sits.
    const maxW = viewport.width * area.width * 0.85;
    const maxH = viewport.height * area.height * 0.8;
    const fit = Math.min(1, maxW / (FIGURE_SIZE * 1.5), maxH / (FIGURE_SIZE * 1.5));
    return { x: (area.x * viewport.width) / 2, y: (area.y * viewport.height) / 2, scale: fit };
  }, [size, viewport]);

  useFrame(({ clock }, dt) => {
    reveal.current = MathUtils.damp(reveal.current, revealed ? 1 : 0, 2.5, dt);
    ring.current.rotation.y = MathUtils.damp(ring.current.rotation.y, target.current!, 3.5, dt);
    // A slow sway instead of a constant spin, so the sky never ends up upside down.
    ring.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.03;
    anchor.current.position.x = MathUtils.damp(anchor.current.position.x, placement.x, 4, dt);
    anchor.current.position.y = MathUtils.damp(anchor.current.position.y, placement.y, 4, dt);
    anchor.current.scale.setScalar(MathUtils.damp(anchor.current.scale.x, placement.scale, 4, dt));
  });

  return (
    <group ref={anchor} position={[placement.x, placement.y, 0]} scale={placement.scale}>
      <group position-z={-RADIUS}>
        <group ref={ring} rotation-y={target.current}>
          {SIGNS.map((sign, i) => (
            <group
              key={sign.id}
              position={[Math.sin(i * STEP) * RADIUS, 0, Math.cos(i * STEP) * RADIUS]}
              rotation-y={i * STEP}
            >
              <Constellation
                figure={CONSTELLATIONS[sign.id]}
                active={sign.id === activeId}
                mine={sign.id === mySign}
                reveal={reveal}
                onSelect={(origin) => (sign.id === activeId ? onOpenGate(origin) : onSelect(sign.id))}
              />
              {moon?.sign === sign.id && revealed && (
                <MoonMarker illumination={moon.illumination} waxing={moon.waxing} onTap={() => onMoonTap?.()} />
              )}
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
