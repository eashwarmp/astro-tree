import { describe, expect, it } from "vitest";
import { CONSTELLATIONS } from "../data/constellations";
import { projectStars } from "./sky";

describe("projectStars", () => {
  it.each(Object.entries(CONSTELLATIONS))("fits %s into the requested box, centred", (_, figure) => {
    const pts = projectStars(figure.stars, 3);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const w = Math.max(...xs) - Math.min(...xs);
    const h = Math.max(...ys) - Math.min(...ys);
    expect(Math.max(w, h)).toBeCloseTo(3, 5);
    expect(Math.max(...xs) + Math.min(...xs)).toBeCloseTo(0, 5);
    expect(Math.max(...ys) + Math.min(...ys)).toBeCloseTo(0, 5);
  });

  it("puts east on the left", () => {
    // Denebola has a larger right ascension (further east) than Regulus.
    const [regulus, , , , , , , , denebola] = projectStars(CONSTELLATIONS.leo.stars);
    expect(denebola[0]).toBeLessThan(regulus[0]);
  });

  it("keeps Pisces in one piece across 0h", () => {
    const pts = projectStars(CONSTELLATIONS.pisces.stars, 3);
    // Omega Piscium (23.99h) and Delta Piscium (0.81h) are ~12° apart; a figure split
    // at 0h would throw them to opposite edges of the 3-unit box.
    const [omega, delta] = [pts[7], pts[6]];
    expect(Math.hypot(omega[0] - delta[0], omega[1] - delta[1])).toBeLessThan(1);
  });

  it("only references stars that exist", () => {
    for (const { stars, edges } of Object.values(CONSTELLATIONS)) {
      for (const [a, b] of edges) {
        expect(stars[a]).toBeDefined();
        expect(stars[b]).toBeDefined();
      }
    }
  });
});
