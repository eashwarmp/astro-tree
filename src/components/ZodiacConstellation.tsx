import { Line } from "@react-three/drei";
import Star from "./Star";
import { ComponentProps } from "react";

type LineExtras = Partial<ComponentProps<typeof Line>>;

interface Props {
  stars: [number, number, number][];
  starOpacity?: number;
  lineProps?: LineExtras;
}

export default function ZodiacConstellation({
  stars,
  starOpacity = 1,
  lineProps = {},
}: Props) {
  return (
    <group>
      {stars.map((pos, i) => (
        <Star key={i} position={pos} opacity={starOpacity} />
      ))}

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
