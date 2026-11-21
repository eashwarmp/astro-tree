import { describe, expect, it } from "vitest";
import { cardSlots, dayKey, fitPoints, inAnyRect, KEEPSAKE_HEIGHT, KEEPSAKE_WIDTH, seededRandom, wrapList, wrapText } from "./keepsake";

// One unit per character keeps the arithmetic obvious.
const measure = (s: string) => s.length;

describe("wrapText", () => {
  it("keeps short text on one line", () => {
    expect(wrapText("Hope, Renewal", 20, measure)).toEqual(["Hope, Renewal"]);
  });

  it("breaks between words without exceeding the width", () => {
    const lines = wrapText("Courage · Compassion · Inner strength", 22, measure);
    expect(lines).toEqual(["Courage · Compassion ·", "Inner strength"]);
    for (const line of lines) expect(measure(line)).toBeLessThanOrEqual(22);
  });

  it("lets a single overlong word overflow rather than splitting it", () => {
    expect(wrapText("Manifestation is", 5, measure)).toEqual(["Manifestation", "is"]);
  });

  it("collapses extra whitespace and handles empty text", () => {
    expect(wrapText("  a   b  ", 10, measure)).toEqual(["a b"]);
    expect(wrapText("", 10, measure)).toEqual([]);
  });
});

describe("wrapList", () => {
  it("joins items with a separator when they fit", () => {
    expect(wrapList(["Joy", "Success", "Vitality"], 40, measure)).toEqual(["Joy · Success · Vitality"]);
  });

  it("breaks between items, never leaving a separator at either end of a line", () => {
    const lines = wrapList(["Impulsiveness", "Burnout", "Aggression"], 24, measure);
    expect(lines).toEqual(["Impulsiveness · Burnout", "Aggression"]);
    for (const line of lines) expect(line).not.toMatch(/^·|·$/);
  });

  it("puts a reversed marker on its own line rather than splitting it from its dot", () => {
    expect(wrapList(["Knight of Swords", "reversed"], 18, measure)).toEqual(["Knight of Swords", "reversed"]);
  });

  it("word-wraps an item that is too long on its own and continues after it", () => {
    expect(wrapList(["Ignoring the call", "Doubt"], 10, measure)).toEqual(["Ignoring", "the call", "Doubt"]);
    expect(wrapList(["Ab", "Ignoring the call", "Cd"], 14, measure)).toEqual(["Ab", "Ignoring the", "call · Cd"]);
  });
});

describe("inAnyRect", () => {
  it("tests points against rects inclusively", () => {
    const rects = [{ x: 0, y: 0, w: 10, h: 10 }, { x: 100, y: 100, w: 5, h: 5 }];
    expect(inAnyRect(10, 10, rects)).toBe(true);
    expect(inAnyRect(102, 104, rects)).toBe(true);
    expect(inAnyRect(50, 50, rects)).toBe(false);
    expect(inAnyRect(1, 1, [])).toBe(false);
  });
});

describe("cardSlots", () => {
  const inside = (r: { x: number; y: number; w: number; h: number }) =>
    r.x >= 0 && r.y >= 0 && r.x + r.w <= KEEPSAKE_WIDTH && r.y + r.h <= KEEPSAKE_HEIGHT;

  it("centres a single large card", () => {
    const [slot] = cardSlots(1, KEEPSAKE_WIDTH);
    expect(slot.x + slot.w / 2).toBe(KEEPSAKE_WIDTH / 2);
    expect(slot.w).toBeGreaterThan(400);
    expect(inside(slot)).toBe(true);
  });

  it("lays three cards in a centred, non-overlapping row with the card's aspect ratio", () => {
    const slots = cardSlots(3, KEEPSAKE_WIDTH);
    expect(slots).toHaveLength(3);
    for (const s of slots) {
      expect(inside(s)).toBe(true);
      expect(s.y).toBe(slots[0].y);
      expect(s.h / s.w).toBeCloseTo(527 / 300, 2);
    }
    expect(slots[0].x + slots[0].w).toBeLessThan(slots[1].x);
    expect(slots[1].x + slots[1].w).toBeLessThan(slots[2].x);
    expect(slots[0].x).toBeCloseTo(KEEPSAKE_WIDTH - (slots[2].x + slots[2].w));
  });

  it("leaves room for captions and the footer below the cards", () => {
    for (const n of [1, 3]) {
      const s = cardSlots(n, KEEPSAKE_WIDTH)[0];
      expect(KEEPSAKE_HEIGHT - (s.y + s.h)).toBeGreaterThanOrEqual(300);
    }
  });
});

describe("fitPoints", () => {
  const box = { x: 240, y: 120, w: 600, h: 360 };

  it("fills the limiting dimension of the box and centres the figure", () => {
    const pts = fitPoints([[-1, -1], [1, 1]], box);
    // Square figure in a wide box: height is the limit.
    expect(pts[0]).toEqual([360, 480]);
    expect(pts[1]).toEqual([720, 120]);
  });

  it("flips y so north is up on the canvas", () => {
    const [low, high] = fitPoints([[0, 0], [0, 5]], box);
    expect(high[1]).toBeLessThan(low[1]);
  });

  it("copes with a degenerate figure", () => {
    expect(fitPoints([[2, 2]], box)).toEqual([[540, 300]]);
  });
});

describe("seededRandom", () => {
  it("is deterministic for a seed and differs between seeds", () => {
    const a = seededRandom("2026-11-21:leo");
    const b = seededRandom("2026-11-21:leo");
    const c = seededRandom("2026-11-22:leo");
    const seqA = Array.from({ length: 5 }, a);
    expect(Array.from({ length: 5 }, b)).toEqual(seqA);
    expect(Array.from({ length: 5 }, c)).not.toEqual(seqA);
    for (const x of seqA) expect(x >= 0 && x < 1).toBe(true);
  });
});

describe("dayKey", () => {
  it("is the same all day and changes at local midnight", () => {
    expect(dayKey(new Date(2026, 10, 21, 0, 1))).toBe(dayKey(new Date(2026, 10, 21, 23, 59)));
    expect(dayKey(new Date(2026, 10, 21))).not.toBe(dayKey(new Date(2026, 10, 22)));
  });
});
