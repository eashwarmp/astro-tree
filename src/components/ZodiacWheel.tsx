// ZodiacWheel.tsx
import { useLoader, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { TextureLoader } from "three";
import * as THREE from "three";

function loadWheel() {
  const texture = useLoader(TextureLoader, "/assets/wheel.png");

  React.useEffect(() => {
    if (!texture.image) return;
    const img = texture.image as HTMLImageElement;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < data.data.length; i += 4) {
      const [r, g, b] = data.data.slice(i, i + 3);
      if (r < 40 && g < 50 && b < 70) data.data[i + 3] = 0;
    }

    ctx.putImageData(data, 0, 0);
    texture.image = canvas;
    texture.needsUpdate = true;
  }, [texture]);

  return texture;
}

export default function ZodiacWheel() {
  const texture = loadWheel();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.5; // speed of spin
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.05} />
    </mesh>
  );
}
