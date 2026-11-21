import { describe, expect, it } from "vitest";
import { signById, stepSign, sunSign } from "./zodiac";

const at = (iso: string) => sunSign(new Date(iso + "Z")).id;

describe("sunSign", () => {
  it("follows the real ingress times rather than fixed calendar dates", () => {
    // 2026 ingresses (UT): Aries Mar 20 14:46; Sagittarius in the early hours of Nov 22.
    expect(at("2026-03-20T12:00:00")).toBe("pisces");
    expect(at("2026-03-20T18:00:00")).toBe("aries");
    expect(at("2026-11-21T22:00:00")).toBe("scorpio");
    expect(at("2026-11-22T12:00:00")).toBe("sagittarius");
  });

  it("puts early January in Capricorn and late January in Aquarius", () => {
    expect(at("2026-01-01T12:00:00")).toBe("capricorn");
    expect(at("2026-01-18T12:00:00")).toBe("capricorn");
    expect(at("2026-01-21T12:00:00")).toBe("aquarius");
    expect(at("2025-12-31T12:00:00")).toBe("capricorn");
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
