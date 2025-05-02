// src/data/layout.ts
export const ARC_POSITIONS = (
  radius = 7 // was 6
) =>
  Array.from({ length: 12 }).map((_, i) => {
    const theta = ((i - 5.5) / 11) * Math.PI;
    return [
      Math.sin(theta) * radius,
      Math.cos(theta) * radius * 0.18 - 1, // lower vertical spread
      0,
    ] as const;
  });
