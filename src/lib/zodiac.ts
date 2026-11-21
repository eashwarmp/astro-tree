import { SIGNS, type Sign, type SignId } from "../data/signs";
import { signOfLongitude, sunLongitude } from "./ephemeris";

/**
 * The sign the Sun is actually in at `date`. The calendar ranges in SIGNS are the usual
 * approximations; the real ingress moves by a day or so from year to year.
 */
export function sunSign(date: Date): Sign {
  return signById(signOfLongitude(sunLongitude(date)))!;
}

export function signById(id: string | null | undefined): Sign | undefined {
  return SIGNS.find((s) => s.id === id?.toLowerCase());
}

export function signIndex(id: SignId): number {
  return SIGNS.findIndex((s) => s.id === id);
}

/** The sign `step` places away from `id`, wrapping around the zodiac. */
export function stepSign(id: SignId, step: number): Sign {
  const n = SIGNS.length;
  return SIGNS[(((signIndex(id) + step) % n) + n) % n];
}
