import { useEffect, useMemo, useRef, useState } from "react";
import { useCursor } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace, type Sprite } from "three";

interface Props {
  /** 0 (new) – 1 (full). */
  illumination: number;
  waxing: boolean;
  onTap: () => void;
}

/** Today's Moon, drawn at its real phase, floating above the constellation it's passing through. */
export default function MoonMarker({ illumination, waxing, onTap }: Props) {
  const texture = useMemo(() => drawMoon(illumination, waxing), [illumination, waxing]);
  useEffect(() => () => texture.dispose(), [texture]);
  const sprite = useRef<Sprite>(null!);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(({ clock }) => {
    sprite.current.position.y = 2.6 + Math.sin(clock.elapsedTime * 0.5) * 0.08;
    sprite.current.scale.setScalar(hovered ? 1.15 : 1);
  });

  const tap = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    onTap();
  };

  return (
    <sprite
      ref={sprite}
      position={[0, 2.6, 0.4]}
      onClick={tap}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    >
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function drawMoon(illumination: number, waxing: boolean) {
  const size = 128;
  const c = size / 2;
  const r = size * 0.28;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const glow = ctx.createRadialGradient(c, c, r * 0.8, c, c, c);
  glow.addColorStop(0, `rgba(255, 240, 210, ${0.15 + illumination * 0.35})`);
  glow.addColorStop(1, "rgba(255, 240, 210, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "rgba(220, 225, 255, 0.16)";
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.fill();

  // Lit limb on the right for a waxing Moon (as seen from the northern hemisphere); mirror when waning.
  ctx.save();
  if (!waxing) {
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
  }
  const rx = Math.abs(1 - 2 * illumination) * r;
  ctx.fillStyle = "#fbf6ea";
  ctx.beginPath();
  ctx.arc(c, c, r, -Math.PI / 2, Math.PI / 2, false);
  ctx.ellipse(c, c, rx, r, 0, Math.PI / 2, -Math.PI / 2, illumination <= 0.5);
  ctx.fill();
  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
