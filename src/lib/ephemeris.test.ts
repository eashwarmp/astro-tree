import { describe, expect, it } from "vitest";
import { lunations, moonLongitude, moonPhase, retrogrades, signOfLongitude, sunLongitude } from "./ephemeris";

const utc = (s: string) => new Date(s + "Z");
const daysBetween = (a: Date, b: Date) => Math.abs(a.getTime() - b.getTime()) / 86_400_000;

describe("Sun", () => {
  it("crosses into Aries at the March equinox", () => {
    // 2026 March equinox: 20 Mar 14:46 UT.
    expect(signOfLongitude(sunLongitude(utc("2026-03-20T12:00:00")))).toBe("pisces");
    expect(signOfLongitude(sunLongitude(utc("2026-03-20T18:00:00")))).toBe("aries");
  });

  it("matches the solstice longitudes", () => {
    expect(sunLongitude(utc("2025-06-21T02:42:00"))).toBeCloseTo(90, 1);
    expect(sunLongitude(utc("2025-12-21T15:03:00"))).toBeCloseTo(270, 1);
  });
});

describe("Moon", () => {
  it("finds the November 2025 lunations", () => {
    const found = lunations(utc("2025-11-01T00:00:00"), utc("2025-12-01T00:00:00"));
    const full = found.find((l) => l.kind === "full")!;
    const fresh = found.find((l) => l.kind === "new")!;
    // Full Moon 5 Nov 2025 13:19 UT in Taurus; New Moon 20 Nov 2025 06:47 UT in Scorpio.
    expect(daysBetween(full.date, utc("2025-11-05T13:19:00"))).toBeLessThan(0.05);
    expect(full.sign).toBe("taurus");
    expect(daysBetween(fresh.date, utc("2025-11-20T06:47:00"))).toBeLessThan(0.05);
    expect(fresh.sign).toBe("scorpio");
  });

  it("names the phase", () => {
    expect(moonPhase(utc("2025-11-05T13:00:00")).phase).toBe("full");
    expect(moonPhase(utc("2025-11-20T07:00:00")).phase).toBe("new");
    expect(moonPhase(utc("2025-11-05T13:00:00")).illumination).toBeGreaterThan(0.99);
  });

  it("moves about 13° a day", () => {
    const a = moonLongitude(utc("2026-01-01T00:00:00"));
    const b = moonLongitude(utc("2026-01-02T00:00:00"));
    const daily = (b - a + 360) % 360;
    expect(daily).toBeGreaterThan(11);
    expect(daily).toBeLessThan(15.5);
  });
});

describe("retrogrades", () => {
  it("finds Mercury's 2025 retrogrades to within two days", () => {
    const periods = retrogrades("mercury", utc("2025-01-01T00:00:00"), utc("2025-12-31T00:00:00"));
    const expected = [
      ["2025-03-15", "2025-04-07"],
      ["2025-07-18", "2025-08-11"],
      ["2025-11-09", "2025-11-29"],
    ];
    expect(periods).toHaveLength(3);
    periods.forEach((p, i) => {
      expect(daysBetween(p.start, utc(expected[i][0] + "T12:00:00"))).toBeLessThan(2);
      expect(daysBetween(p.end, utc(expected[i][1] + "T12:00:00"))).toBeLessThan(2);
    });
  });

  it("reports a sign change during a retrograde", () => {
    // Venus stations retrograde in Scorpio on 3 Oct 2026 and direct in Libra on 13 Nov 2026.
    const [venus] = retrogrades("venus", utc("2026-10-01T00:00:00"), utc("2026-11-30T00:00:00"));
    expect(daysBetween(venus.start, utc("2026-10-03T12:00:00"))).toBeLessThan(2);
    expect(daysBetween(venus.end, utc("2026-11-13T12:00:00"))).toBeLessThan(2);
    expect(venus.sign).toBe("scorpio");
    expect(venus.endSign).toBe("libra");
  });
});
