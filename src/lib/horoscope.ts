import { HOUSES, MOON_INTROS, RETROGRADE_LINES } from "../data/horoscope/houses";
import { ELEMENT_TIPS, LUCKY_COLORS, TIP_CODAS, UNIVERSAL_TIPS } from "../data/horoscope/tips";
import { PHASE_LINES, VOICES } from "../data/horoscope/voices";
import { SIGNS, type SignId } from "../data/signs";
import {
  PHASE_NAMES,
  ZODIAC_ORDER,
  lunations,
  moonLongitude,
  moonPhase,
  retrogrades,
  signOfLongitude,
  sunLongitude,
  type MoonPhase,
  type Planet,
  type ZodiacSign,
} from "./ephemeris";

// Readings are assembled from the real sky (which sign the Moon is in, its phase, the Sun's
// house) plus hand-written phrases.
//
// Each sentence slot walks its own pool in a scrambled order, so a sentence never returns
// before the rest of its pool has been used (an opener not within 7 days, a closer not within
// 11). The pool sizes (7 openers, 3 focus phrases, 8 pieces of advice, 11 closers) are pairwise
// coprime, so by the Chinese remainder theorem the whole combination doesn't recur for
// 7 × 3 × 8 × 11 = 1848 days.

export interface DailyHoroscope {
  date: string;
  sign: SignId;
  moon: { sign: ZodiacSign; signName: string; phase: MoonPhase; phaseName: string; illumination: number; house: number };
  reading: string;
  tip: string;
  lucky: { number: number; color: string; hours: string };
}

export interface MonthlyHoroscope {
  year: number;
  month: number;
  sign: SignId;
  sun: { sign: ZodiacSign; house: number; ingress?: { sign: ZodiacSign; date: string } };
  overview: string;
  focus: string;
  avoid: string;
  /** `end` is set for retrogrades; dates are local ISO days. */
  events: { date: string; end?: string; kind: "new" | "full" | Planet; text: string }[];
}

const DAY_MS = 86_400_000;
const nameOf = (sign: ZodiacSign) => SIGNS.find((s) => s.id === sign)!.name;
const signIdx = (id: SignId) => ZODIAC_ORDER.indexOf(id);

export function dailyHoroscope(id: SignId, date: Date): DailyHoroscope {
  const day = dayNumber(date);
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const moonSign = signOfLongitude(moonLongitude(noon));
  const { phase, illumination } = moonPhase(noon);
  const house = houseOf(moonSign, id);
  const voice = VOICES[id];
  const s = signIdx(id);

  const h = HOUSES[house - 1];
  const reading = [
    MOON_INTROS[cycle(day, MOON_INTROS.length, 3, s)].replace("{moon}", nameOf(moonSign)).replace("{focus}", h.focus[cycle(day, h.focus.length, 2, s)]),
    h.advice[cycle(day, h.advice.length, 3, s * 5)],
    PHASE_LINES[phase][phaseLineIndex(noon, phase, day)],
    voice.closers[cycle(day, voice.closers.length, 4, s * 7)],
  ].join(" ");

  const tips = [...ELEMENT_TIPS[voice.element], ...UNIVERSAL_TIPS];
  const [tipIdx, codaIdx] = variant(day, s * 733 + 5, [tips.length, TIP_CODAS.length]);

  const rand = mulberry32(day * 12 + s);
  const start = 6 + Math.floor(rand() * 15);

  return {
    date: isoDate(date),
    sign: id,
    moon: { sign: moonSign, signName: nameOf(moonSign), phase, phaseName: PHASE_NAMES[phase], illumination, house },
    reading,
    tip: `${tips[tipIdx]} ${TIP_CODAS[codaIdx]}`,
    lucky: {
      number: 1 + Math.floor(rand() * 99),
      color: LUCKY_COLORS[Math.floor(rand() * LUCKY_COLORS.length)],
      hours: `${clock(start)}–${clock(start + 2)}`,
    },
  };
}

/** `month` is 1–12. */
export function monthlyHoroscope(id: SignId, year: number, month: number): MonthlyHoroscope {
  const first = new Date(year, month - 1, 1);
  const next = new Date(year, month, 1);
  const days = Math.round((next.getTime() - first.getTime()) / DAY_MS);

  // The sign the Sun occupies for most of the month, and the day it moves on.
  const counts = new Map<ZodiacSign, number>();
  let ingress: MonthlyHoroscope["sun"]["ingress"];
  let prev: ZodiacSign | null = null;
  for (let d = 1; d <= days; d++) {
    const sign = signOfLongitude(sunLongitude(new Date(year, month - 1, d, 12)));
    counts.set(sign, (counts.get(sign) ?? 0) + 1);
    if (prev && sign !== prev) ingress = { sign, date: isoDate(new Date(year, month - 1, d)) };
    prev = sign;
  }
  const sunSign = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const house = houseOf(sunSign, id);
  const h = HOUSES[house - 1];
  const monthName = first.toLocaleDateString("en-US", { month: "long" });

  const lead =
    `The Sun spends most of ${monthName} in ${nameOf(sunSign)}, your ${ordinal(house)} house of ${h.topic}` +
    (ingress && ingress.sign !== sunSign ? `, then moves into ${nameOf(ingress.sign)} on ${short(ingress.date)}.` : ".");

  const events: MonthlyHoroscope["events"] = lunations(first, next).map((l) => {
    const lh = HOUSES[houseOf(l.sign, id) - 1];
    const label = l.kind === "new" ? "New Moon" : "Full Moon";
    return {
      date: isoDate(l.date),
      kind: l.kind,
      text: `${label} in ${nameOf(l.sign)}, ${short(isoDate(l.date))}: ${l.kind === "new" ? lh.newMoon : lh.fullMoon}`,
    };
  });
  for (const planet of ["mercury", "venus", "mars"] as const) {
    for (const r of retrogrades(planet, first, new Date(next.getTime() - 1))) {
      const rh = HOUSES[houseOf(r.sign, id) - 1];
      const name = planet[0].toUpperCase() + planet.slice(1);
      const where = r.sign === r.endSign ? nameOf(r.sign) : `${nameOf(r.sign)} → ${nameOf(r.endSign)}`;
      events.push({
        date: isoDate(r.start),
        end: isoDate(r.end),
        kind: planet,
        text:
          `${name} retrograde in ${where}, ${short(isoDate(r.start))} – ${short(isoDate(r.end))}: ` +
          RETROGRADE_LINES[planet].replace("{topic}", rh.topic),
      });
    }
  }
  events.sort((a, b) => a.date.localeCompare(b.date));

  return {
    year,
    month,
    sign: id,
    sun: { sign: sunSign, house, ingress },
    overview: `${lead} ${h.month[year % h.month.length]}`,
    focus: h.monthFocus,
    avoid: h.monthAvoid,
    events,
  };
}

/** Position of `day` in a pool of `size`, stepping by `stride` (coprime with `size`) so the order looks shuffled. */
function cycle(day: number, size: number, stride: number, offset: number) {
  return (((day * stride + offset) % size) + size) % size;
}

/**
 * A phase lasts one to seven days. Counting days since the phase began gives each day of one
 * phase a different line, and the lunation number shifts the lines from one month to the next.
 */
function phaseLineIndex(noon: Date, phase: MoonPhase, day: number) {
  let daysIn = 0;
  while (daysIn < 8 && moonPhase(new Date(noon.getTime() - (daysIn + 1) * DAY_MS)).phase === phase) daysIn++;
  const lunation = Math.floor((day - daysIn) / 29.530589);
  return (daysIn + lunation) % PHASE_LINES[phase].length;
}

/** Whole-sign houses counted from the reader's sign: their own sign is the 1st house. */
function houseOf(sign: ZodiacSign, from: SignId) {
  return ((ZODIAC_ORDER.indexOf(sign) - signIdx(from) + 12) % 12) + 1;
}

/** Days since 2000-01-01 for the calendar date (time zone independent). */
function dayNumber(date: Date) {
  return Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(2000, 0, 1)) / DAY_MS);
}

/**
 * Picks one index per radix. (day + salt) × stride mod N is a bijection on 0…N-1 when the
 * stride is coprime with N, so any N consecutive days get N different combinations, and
 * neighbouring days land far apart in the table.
 */
export function variant(day: number, salt: number, radices: number[]): number[] {
  const n = radices.reduce((a, b) => a * b, 1);
  let stride = 7919;
  while (gcd(stride, n) !== 1) stride += 2;
  let k = (((((day + salt) % n) + n) % n) * stride) % n;
  return radices.map((r) => {
    const digit = k % r;
    k = Math.floor(k / r);
    return digit;
  });
}

/**
 * How many consecutive days are guaranteed unique for a sign, for reading and tip respectively.
 * The reading's pools must be pairwise coprime for the product to hold (the tests check this).
 */
export function uniquenessWindow(id: SignId) {
  const tips = ELEMENT_TIPS[VOICES[id].element].length + UNIVERSAL_TIPS.length;
  return {
    reading: MOON_INTROS.length * HOUSES[0].focus.length * HOUSES[0].advice.length * VOICES[id].closers.length,
    readingPools: [MOON_INTROS.length, HOUSES[0].focus.length, HOUSES[0].advice.length, VOICES[id].closers.length],
    tip: tips * TIP_CODAS.length,
  };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function short(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function clock(hour: number) {
  const h = ((hour + 11) % 12) + 1;
  return `${h} ${hour < 12 || hour === 24 ? "AM" : "PM"}`;
}

function ordinal(n: number) {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${s}`;
}
