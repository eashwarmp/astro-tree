import { describe, expect, it } from "vitest";
import { SIGNS } from "../data/signs";
import { HOUSES } from "../data/horoscope/houses";
import { ELEMENT_TIPS, TIP_CODAS, UNIVERSAL_TIPS } from "../data/horoscope/tips";
import { VOICES } from "../data/horoscope/voices";
import { dailyHoroscope, monthlyHoroscope, uniquenessWindow, variant } from "./horoscope";

const THREE_YEARS = 3 * 366;

function* days(from: Date, count: number) {
  for (let i = 0; i < count; i++) yield new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
}

describe("daily horoscopes", () => {
  it.each(SIGNS.map((s) => s.id))("never repeat a reading or tip for %s within three years", (id) => {
    const readings = new Set<string>();
    const tips = new Set<string>();
    for (const d of days(new Date(2026, 0, 1), THREE_YEARS)) {
      const h = dailyHoroscope(id, d);
      readings.add(h.reading);
      tips.add(h.tip);
    }
    expect(readings.size).toBe(THREE_YEARS);
    expect(tips.size).toBe(THREE_YEARS);
  });

  it("guarantees uniqueness well beyond three years", () => {
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
    for (const s of SIGNS) {
      const w = uniquenessWindow(s.id);
      // The reading's window is only the product of its pool sizes if they share no factor.
      for (const [i, a] of w.readingPools.entries())
        for (const b of w.readingPools.slice(i + 1)) expect(gcd(a, b), `${a} and ${b}`).toBe(1);
      expect(w.reading).toBeGreaterThan(THREE_YEARS);
      expect(w.tip).toBeGreaterThan(THREE_YEARS);
    }
    for (const h of HOUSES) {
      expect(h.focus).toHaveLength(HOUSES[0].focus.length);
      expect(h.advice).toHaveLength(HOUSES[0].advice.length);
    }
  });

  it.each(SIGNS.map((s) => s.id))("doesn't repeat any single sentence for %s within a week", (id) => {
    const lastSeen = new Map<string, number>();
    let closest = Infinity;
    let d = 0;
    for (const day of days(new Date(2026, 0, 1), 400)) {
      // Skip the opener: it embeds the Moon's sign, so compare the other three sentences.
      for (const sentence of dailyHoroscope(id, day).reading.split(/(?<=[.!?])\s+/).slice(1)) {
        if (lastSeen.has(sentence)) closest = Math.min(closest, d - lastSeen.get(sentence)!);
        lastSeen.set(sentence, d);
      }
      d++;
    }
    expect(closest).toBeGreaterThanOrEqual(7);
  });

  it("differs between signs on the same day", () => {
    const day = new Date(2026, 4, 10);
    const readings = new Set(SIGNS.map((s) => dailyHoroscope(s.id, day).reading));
    expect(readings.size).toBe(12);
  });

  it("is stable for a given day", () => {
    const a = dailyHoroscope("leo", new Date(2026, 6, 4, 8));
    const b = dailyHoroscope("leo", new Date(2026, 6, 4, 22));
    expect(a).toEqual(b);
  });

  it("counts the Moon's house from the reader's sign", () => {
    // 5 Nov 2025: Full Moon in Taurus.
    const d = new Date(2025, 10, 5);
    expect(dailyHoroscope("taurus", d).moon.house).toBe(1);
    expect(dailyHoroscope("aries", d).moon.house).toBe(2);
    expect(dailyHoroscope("gemini", d).moon.house).toBe(12);
    expect(dailyHoroscope("taurus", d).moon.phase).toBe("full");
  });
});

describe("monthly horoscopes", () => {
  it("names the Sun's sign, its house and the month's lunations", () => {
    const m = monthlyHoroscope("scorpio", 2025, 11);
    expect(m.sun.sign).toBe("scorpio");
    expect(m.sun.house).toBe(1);
    expect(m.sun.ingress?.sign).toBe("sagittarius");
    expect(m.events.some((e) => e.kind === "full" && e.text.includes("Taurus"))).toBe(true);
    expect(m.events.some((e) => e.kind === "new" && e.text.includes("Scorpio"))).toBe(true);
    expect(m.events.some((e) => e.kind === "mercury")).toBe(true);
  });

  it.each(SIGNS.map((s) => s.id))("gives %s a different overview every month for three years", (id) => {
    const seen = new Set<string>();
    for (let i = 0; i < 36; i++) seen.add(monthlyHoroscope(id, 2026 + Math.floor(i / 12), (i % 12) + 1).overview);
    expect(seen.size).toBe(36);
  });
});

describe("content", () => {
  it("has no duplicate phrases that could make two days read the same", () => {
    const all = [
      ...HOUSES.flatMap((h) => [...h.focus, ...h.advice]),
      ...Object.values(VOICES).flatMap((v) => v.closers),
    ];
    expect(new Set(all).size).toBe(all.length);
    const tips = [...Object.values(ELEMENT_TIPS).flat(), ...UNIVERSAL_TIPS, ...TIP_CODAS];
    expect(new Set(tips).size).toBe(tips.length);
  });
});

describe("variant", () => {
  it("is a permutation over its full cycle", () => {
    const radices = [4, 3, 5];
    const seen = new Set<string>();
    for (let d = 0; d < 60; d++) seen.add(variant(d, 7, radices).join(","));
    expect(seen.size).toBe(60);
  });
});
