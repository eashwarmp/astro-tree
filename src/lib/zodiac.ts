import { SIGNS, type Sign, type SignId } from "../data/signs";

/** The sign whose date range contains `date` (local time). */
export function signForDate(date: Date): Sign {
  const key = (date.getMonth() + 1) * 100 + date.getDate();
  // Walk the signs from the latest start date in the calendar year back to the earliest;
  // anything before Aquarius (Jan 20) still belongs to December's Capricorn.
  const byStart = [...SIGNS].sort((a, b) => startKey(b) - startKey(a));
  return byStart.find((s) => key >= startKey(s)) ?? byStart[0];
}

function startKey(sign: Sign) {
  return sign.starts[0] * 100 + sign.starts[1];
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
