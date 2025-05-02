import { SpriteMaterial, AdditiveBlending } from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Star({
  position,
  size = 0.22,
  opacity = 1,
}: {
  position: [number, number, number];
  size?: number;
  opacity?: number;
}) {
  const tex = useLoader(TextureLoader, "/assets/star.png");

  return (
    <sprite position={position} scale={[size, size, size]}>
      <spriteMaterial
        map={tex}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={AdditiveBlending}
        attach="material"
        color="white"
      />
    </sprite>
  );
}
