import { Line } from "@react-three/drei";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import Star from "./Star";
import { ComponentProps } from "react";

type LineExtras = Partial<ComponentProps<typeof Line>>;

interface Props {
  stars: [number, number, number][];
  starOpacity?: number;
  lineProps?: LineExtras;
  name?: string;
  isActive?: boolean;
}

export default function ZodiacConstellation({
  stars,
  starOpacity = 1,
  lineProps = {},
  name,
  isActive,
}: Props) {
  const anchors: React.ReactElement[] = [];

  if (isActive && name) {
    const [ax, ay] = stars[0]; // pick first star as anchor
    anchors.push(
      <Html key={`${name}-anchor`} transform position={[ax, ay, 0]} zIndexRange={[1,0]}>
        <motion.div layoutId={`card-${name}`} style={{width:14, height:22, borderRadius:4}} />
      </Html>
    );
  }

  return (
    <group>
      {stars.map((pos, i) => (
        <Star key={i} position={pos} opacity={starOpacity} />
      ))}
      {anchors}
      <Line
        points={stars}
        color="white"
        linewidth={0.8}
        transparent
        {...lineProps}
      />
    </group>
  );
}
