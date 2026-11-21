import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { CanvasTexture, MathUtils, SRGBColorSpace } from "three";

/**
 * Loads a square artwork on a dark background and cuts it out as a disc: everything outside
 * `radius` (fraction of the width) becomes transparent with a soft edge, and the dark fill
 * inside is made partly see-through so the nebula glows through the wheel.
 */
export function useKeyedTexture(url: string, radius = 0.485): CanvasTexture {
  const source = useTexture(url);

  return useMemo(() => {
    const img = source.image as HTMLImageElement;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = data.data;
    const c = canvas.width / 2;
    const edge = canvas.width * radius;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const outside = MathUtils.clamp((Math.hypot(x - c, y - c) - edge) / 4, 0, 1);
        const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        // Dark navy fill → ~55% opacity; lines and glyphs stay solid.
        const fill = lum < 60 ? 0.55 : 1;
        px[i + 3] = 255 * fill * (1 - outside);
      }
    }
    ctx.putImageData(data, 0, 0);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [source, radius]);
}

