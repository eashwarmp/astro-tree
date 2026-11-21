import type { CatalogStar } from "../data/constellations";

export type Vec3 = [number, number, number];

/**
 * Projects catalog stars onto a flat patch of sky (gnomonic projection around the
 * figure's centre), then centres and scales them so the figure's longest side is `size`.
 * East is to the left, as it is when you look up at the real sky.
 */
export function projectStars(stars: CatalogStar[], size = 3): Vec3[] {
  const unit = stars.map(({ ra, dec }) => {
    const a = (ra / 24) * Math.PI * 2;
    const d = (dec / 180) * Math.PI;
    return [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)];
  });

  // Averaging unit vectors (rather than ra/dec) keeps figures that straddle 0h, like Pisces, intact.
  const c = normalize(unit.reduce((acc, v) => acc.map((x, i) => x + v[i]), [0, 0, 0]));
  const east = normalize([-c[1], c[0], 0]);
  const north = cross(c, east);

  const flat = unit.map((v) => {
    const k = dot(v, c);
    return [-dot(v, east) / k, dot(v, north) / k];
  });

  const xs = flat.map((p) => p[0]);
  const ys = flat.map((p) => p[1]);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
  const cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
  const scale = size / span;

  return flat.map(([x, y]) => [(x - cx) * scale, (y - cy) * scale, 0]);
}

/** Sprite size for a star of the given apparent magnitude: brighter stars draw bigger. */
export function starSize(mag: number): number {
  return 0.16 + Math.max(0, 4.8 - mag) * 0.07;
}

function dot(a: number[], b: number[]) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: number[], b: number[]) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function normalize(v: number[]) {
  const len = Math.hypot(v[0], v[1], v[2]);
  return v.map((x) => x / len);
}
