import { describe, expect, it } from "vitest";
import { numerologyDay, dayRuler, formatClock, planetaryHour, reduce, sunTimes } from "./lucky";

describe("numerology", () => {
  it("reduces to one digit but keeps master numbers", () => {
    expect(reduce(2026)).toBe(1);
    expect(reduce(29)).toBe(11);
    expect(reduce(1993)).toBe(22);
    expect(reduce(7)).toBe(7);
  });

  it("computes the universal and personal day numbers", () => {
    // 21 Nov 2026: year 2026 → 1, month 11, day 21 → 3; 1 + 11 + 3 = 15 → 6.
    expect(numerologyDay(new Date(2026, 10, 21))).toBe(6);
    // Birthday 14 Feb: personal year 2 + 5 + 1 = 8; + month 11 = 19 → 1; + day 3 = 4.
    expect(numerologyDay(new Date(2026, 10, 21), { month: 2, day: 14 })).toBe(4);
  });
});

describe("planetary hours", () => {
  it("names the weekday rulers", () => {
    expect(dayRuler(new Date(2026, 10, 22))).toBe("sun"); // Sunday
    expect(dayRuler(new Date(2026, 10, 21))).toBe("saturn"); // Saturday
  });

  it("starts the day with the weekday ruler's hour", () => {
    const d = new Date(2026, 10, 22);
    const { rise } = sunTimes(d);
    expect(planetaryHour(d, "sun").start).toBeCloseTo(rise, 5);
    // Sunday's second hour belongs to Venus, the next planet in Chaldean order.
    const venus = planetaryHour(d, "venus");
    expect(venus.start).toBeGreaterThan(rise);
  });

  it("makes summer days longer than winter days at 40°N", () => {
    const summer = sunTimes(new Date(2026, 5, 21));
    const winter = sunTimes(new Date(2026, 11, 21));
    expect((summer.set - summer.rise) / 60).toBeCloseTo(15, 0);
    expect((winter.set - winter.rise) / 60).toBeCloseTo(9.3, 0);
  });

  it("formats to the nearest five minutes", () => {
    expect(formatClock(7 * 60 + 2)).toBe("7:00 AM");
    expect(formatClock(13 * 60 + 58)).toBe("2:00 PM");
  });
});
