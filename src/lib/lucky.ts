import type { Element } from "../data/horoscope/voices";
import type { SignId } from "../data/signs";
import { sunLongitude } from "./ephemeris";

// The "lucky" extras, each from a traditional system rather than a random number:
// numerology for the number, the weekday's planetary ruler for the colour, and planetary
// hours for the best time of day.

export type ClassicalPlanet = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";

/** Traditional (pre-telescopic) rulers, the ones planetary hours use. */
export const TRADITIONAL_RULER: Record<SignId, ClassicalPlanet> = {
  aries: "mars", taurus: "venus", gemini: "mercury", cancer: "moon", leo: "sun", virgo: "mercury",
  libra: "venus", scorpio: "mars", sagittarius: "jupiter", capricorn: "saturn", aquarius: "saturn", pisces: "jupiter",
};

export const PLANET_NAMES: Record<ClassicalPlanet, string> = {
  sun: "Sun", moon: "Moon", mars: "Mars", mercury: "Mercury", jupiter: "Jupiter", venus: "Venus", saturn: "Saturn",
};

/** Sunday → Saturday. */
const WEEKDAY_RULERS: ClassicalPlanet[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
/** Chaldean order, slowest to fastest: each planetary hour passes to the next in this list. */
const CHALDEAN: ClassicalPlanet[] = ["saturn", "jupiter", "mars", "sun", "venus", "mercury", "moon"];

const PLANET_COLOURS: Record<ClassicalPlanet, Record<Element, string>> = {
  sun: { fire: "Gold", earth: "Amber", air: "Sunflower yellow", water: "Marigold" },
  moon: { fire: "Pearl white", earth: "Silver", air: "Moonstone grey", water: "Seafoam" },
  mars: { fire: "Scarlet", earth: "Rust", air: "Coral", water: "Crimson" },
  mercury: { fire: "Tangerine", earth: "Ochre", air: "Lemon", water: "Turquoise" },
  jupiter: { fire: "Royal purple", earth: "Plum", air: "Sky blue", water: "Royal blue" },
  venus: { fire: "Rose pink", earth: "Emerald", air: "Blush", water: "Jade" },
  saturn: { fire: "Charcoal", earth: "Indigo", air: "Slate", water: "Midnight blue" },
};

/** Sum digits until one remains, keeping the master numbers 11 and 22. */
export function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22) n = String(n).split("").reduce((a, d) => a + Number(d), 0);
  return n;
}

/**
 * Numerology for the day. With a birthday it's the personal day number
 * (birth month + birth day + current year → personal year, + month, + day);
 * without one, the universal day number of the date.
 */
export function numerologyDay(date: Date, birthday?: { month: number; day: number }): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (!birthday) return reduce(reduce(y) + reduce(m) + reduce(d));
  const personalYear = reduce(reduce(birthday.month) + reduce(birthday.day) + reduce(y));
  return reduce(reduce(personalYear + reduce(m)) + reduce(d));
}

export function dayRuler(date: Date): ClassicalPlanet {
  return WEEKDAY_RULERS[date.getDay()];
}

export function luckyColour(date: Date, element: Element): string {
  return PLANET_COLOURS[dayRuler(date)][element];
}

/** Assumed latitude when the reader's location isn't known: mid-northern, like most of the US and Europe. */
export const DEFAULT_LATITUDE = 40;

/**
 * Approximate local sunrise and sunset (minutes after midnight). Uses the Sun's real
 * declination; assumes solar noon at 12:00 standard time, so it can be off by up to half an
 * hour depending on where in the time zone the reader lives.
 */
export function sunTimes(date: Date, latitude = DEFAULT_LATITUDE): { rise: number; set: number } {
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const decl = Math.asin(Math.sin((23.44 * Math.PI) / 180) * Math.sin((sunLongitude(noon) * Math.PI) / 180));
  const lat = (latitude * Math.PI) / 180;
  // -0.833° accounts for refraction and the Sun's radius, as almanacs do.
  const cosH = (Math.sin((-0.833 * Math.PI) / 180) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl));
  const halfDay = (Math.acos(Math.min(1, Math.max(-1, cosH))) * 180) / Math.PI / 15; // hours
  const solarNoon = 12 * 60 + (isDaylightSaving(date) ? 60 : 0);
  return { rise: solarNoon - halfDay * 60, set: solarNoon + halfDay * 60 };
}

/**
 * The first daytime planetary hour ruled by `planet`. The day from sunrise to sunset is split
 * into twelve equal hours; the first belongs to the weekday's ruler and the rest follow the
 * Chaldean order. Every planet rules at least one of the twelve.
 */
export function planetaryHour(date: Date, planet: ClassicalPlanet, latitude = DEFAULT_LATITUDE) {
  const { rise, set } = sunTimes(date, latitude);
  const length = (set - rise) / 12;
  const first = CHALDEAN.indexOf(dayRuler(date));
  for (let i = 0; i < 12; i++) {
    if (CHALDEAN[(first + i) % 7] === planet) return { start: rise + i * length, end: rise + (i + 1) * length };
  }
  throw new Error("unreachable: every planet rules a daytime hour");
}

export function formatClock(minutes: number): string {
  const rounded = Math.round(minutes / 5) * 5;
  const h24 = Math.floor(rounded / 60) % 24;
  const m = rounded % 60;
  const h = ((h24 + 11) % 12) + 1;
  return `${h}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

function isDaylightSaving(date: Date) {
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return date.getTimezoneOffset() < Math.max(jan, jul);
}
