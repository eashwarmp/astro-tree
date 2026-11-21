import { describe, expect, it } from "vitest";
import { signById, signForDate, stepSign } from "./zodiac";

const on = (month: number, day: number) => signForDate(new Date(2026, month - 1, day)).id;

describe("signForDate", () => {
  it("handles every cusp", () => {
    expect(on(3, 20)).toBe("pisces");
    expect(on(3, 21)).toBe("aries");
    expect(on(4, 20)).toBe("taurus");
    expect(on(5, 21)).toBe("gemini");
    expect(on(6, 21)).toBe("cancer");
    expect(on(7, 23)).toBe("leo");
    expect(on(8, 23)).toBe("virgo");
    expect(on(9, 23)).toBe("libra");
    expect(on(10, 23)).toBe("scorpio");
    expect(on(11, 21)).toBe("scorpio");
    expect(on(11, 22)).toBe("sagittarius");
    expect(on(12, 22)).toBe("capricorn");
    expect(on(2, 19)).toBe("pisces");
  });

  it("keeps early January in Capricorn and late January in Aquarius", () => {
    expect(on(1, 1)).toBe("capricorn");
    expect(on(1, 19)).toBe("capricorn");
    expect(on(1, 20)).toBe("aquarius");
    expect(on(12, 31)).toBe("capricorn");
  });
});

describe("stepSign", () => {
  it("wraps in both directions", () => {
    expect(stepSign("pisces", 1).id).toBe("aries");
    expect(stepSign("aries", -1).id).toBe("pisces");
    expect(stepSign("leo", 12).id).toBe("leo");
  });
});

describe("signById", () => {
  it("is case-insensitive and rejects unknown ids", () => {
    expect(signById("LEO")?.name).toBe("Leo");
    expect(signById("ophiuchus")).toBeUndefined();
    expect(signById(null)).toBeUndefined();
  });
});
