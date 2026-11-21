// Low-precision ephemeris: where the Sun, Moon and inner planets sit in the tropical zodiac.
// Sun and Moon follow Meeus, "Astronomical Algorithms" (ch. 25 and the main terms of ch. 47),
// good to a few hundredths of a degree. Planets use JPL's approximate Keplerian elements
// (Standish, valid 1800–2050), good to well under a degree — plenty to tell which sign a
// planet is in and when it turns retrograde.

const DEG = Math.PI / 180;
const DAY_MS = 86_400_000;

export const ZODIAC_ORDER = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
] as const;
export type ZodiacSign = (typeof ZODIAC_ORDER)[number];

/** Julian centuries since J2000.0 (UT is close enough to TT at this precision). */
function centuries(date: Date) {
  return (date.getTime() / DAY_MS + 2440587.5 - 2451545.0) / 36525;
}

const norm = (deg: number) => ((deg % 360) + 360) % 360;
const sin = (deg: number) => Math.sin(deg * DEG);
const cos = (deg: number) => Math.cos(deg * DEG);

export function signOfLongitude(lon: number): ZodiacSign {
  return ZODIAC_ORDER[Math.floor(norm(lon) / 30)];
}

/** Apparent geocentric ecliptic longitude of the Sun, degrees. */
export function sunLongitude(date: Date): number {
  const T = centuries(date);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
    (0.019993 - 0.000101 * T) * sin(2 * M) +
    0.000289 * sin(3 * M);
  const omega = 125.04 - 1934.136 * T;
  return norm(L0 + C - 0.00569 - 0.00478 * sin(omega));
}

// [D, M, M', F, coefficient in 1e-6 degrees] — the largest periodic terms of the Moon's longitude.
const MOON_TERMS: [number, number, number, number, number][] = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236],
];

/** Geocentric ecliptic longitude of the Moon, degrees. */
export function moonLongitude(date: Date): number {
  const T = centuries(date);
  const Lp = 218.3164477 + 481267.88123421 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const F = 93.272095 + 483202.0175233 * T;
  const E = 1 - 0.002516 * T;

  let sum = 0;
  for (const [d, m, mp, f, coeff] of MOON_TERMS) {
    const eccentricity = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1;
    sum += coeff * eccentricity * sin(d * D + m * M + mp * Mp + f * F);
  }
  return norm(Lp + sum / 1e6);
}

export type MoonPhase =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export const PHASE_NAMES: Record<MoonPhase, string> = {
  new: "New Moon",
  "waxing-crescent": "Waxing Crescent",
  "first-quarter": "First Quarter",
  "waxing-gibbous": "Waxing Gibbous",
  full: "Full Moon",
  "waning-gibbous": "Waning Gibbous",
  "last-quarter": "Last Quarter",
  "waning-crescent": "Waning Crescent",
};

/** Moon–Sun elongation, 0 at new moon and 180 at full. */
export function elongation(date: Date): number {
  return norm(moonLongitude(date) - sunLongitude(date));
}

/** The named phases (new, quarters, full) get ±12° — about a day either side of the exact moment. */
export function moonPhase(date: Date): { phase: MoonPhase; illumination: number } {
  const e = elongation(date);
  const illumination = (1 - cos(e)) / 2;
  const phase: MoonPhase =
    e < 12 || e >= 348 ? "new"
    : e < 78 ? "waxing-crescent"
    : e < 102 ? "first-quarter"
    : e < 168 ? "waxing-gibbous"
    : e < 192 ? "full"
    : e < 258 ? "waning-gibbous"
    : e < 282 ? "last-quarter"
    : "waning-crescent";
  return { phase, illumination };
}

export interface Lunation {
  kind: "new" | "full";
  date: Date;
  sign: ZodiacSign;
}

/** Every new and full moon between `from` and `to`, to within a few minutes. */
export function lunations(from: Date, to: Date): Lunation[] {
  const out: Lunation[] = [];
  const step = 6 * 3_600_000;
  for (let t = from.getTime(); t < to.getTime(); t += step) {
    for (const [kind, target] of [["new", 0], ["full", 180]] as const) {
      // Angle relative to the target, in (-180, 180]; a sign change from - to + is a crossing.
      const rel = (ms: number) => norm(elongation(new Date(ms)) - target + 180) - 180;
      const a = rel(t);
      const b = rel(t + step);
      if (a < 0 && b >= 0) {
        let lo = t;
        let hi = t + step;
        for (let i = 0; i < 20; i++) {
          const mid = (lo + hi) / 2;
          if (rel(mid) < 0) lo = mid;
          else hi = mid;
        }
        const date = new Date(hi);
        if (date >= from && date < to) out.push({ kind, date, sign: signOfLongitude(moonLongitude(date)) });
      }
    }
  }
  return out.sort((x, y) => x.date.getTime() - y.date.getTime());
}

// a (AU), e, I, L, long. perihelion, long. ascending node — value at J2000 and rate per century.
type Elements = [number, number, number, number, number, number];
const PLANETS: Record<"mercury" | "venus" | "earth" | "mars", [Elements, Elements]> = {
  mercury: [
    [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593],
    [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
  ],
  venus: [
    [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255],
    [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418],
  ],
  earth: [
    [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0],
    [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0],
  ],
  mars: [
    [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
    [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
  ],
};

export type Planet = "mercury" | "venus" | "mars";

function heliocentric(body: keyof typeof PLANETS, T: number): [number, number, number] {
  const [base, rate] = PLANETS[body];
  const [a, e, I, L, peri, node] = base.map((v, i) => v + rate[i] * T);
  const w = peri - node;
  const M = norm(L - peri) * DEG;
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 6; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  return [
    (cos(w) * cos(node) - sin(w) * sin(node) * cos(I)) * xp + (-sin(w) * cos(node) - cos(w) * sin(node) * cos(I)) * yp,
    (cos(w) * sin(node) + sin(w) * cos(node) * cos(I)) * xp + (-sin(w) * sin(node) + cos(w) * cos(node) * cos(I)) * yp,
    sin(w) * sin(I) * xp + cos(w) * sin(I) * yp,
  ];
}

/** Geocentric ecliptic longitude of a planet, degrees (equinox of date). */
export function planetLongitude(planet: Planet, date: Date): number {
  const T = centuries(date);
  const p = heliocentric(planet, T);
  const earth = heliocentric("earth", T);
  const lon = Math.atan2(p[1] - earth[1], p[0] - earth[0]) / DEG;
  // Elements are referred to J2000; add general precession so signs match the tropical zodiac of date.
  return norm(lon + 1.396971 * T);
}

export interface Retrograde {
  planet: Planet;
  start: Date;
  end: Date;
  /** Sign at the retrograde station, and at the direct station (they can differ). */
  sign: ZodiacSign;
  endSign: ZodiacSign;
}

/** Retrograde periods that overlap [from, to], with stations found to the nearest day. */
export function retrogrades(planet: Planet, from: Date, to: Date): Retrograde[] {
  const moving = (ms: number) => {
    const delta = norm(planetLongitude(planet, new Date(ms + DAY_MS)) - planetLongitude(planet, new Date(ms)) + 180) - 180;
    return delta < 0;
  };
  // Look back far enough to catch a retrograde already underway on `from` (Mars's last ~80 days).
  const start = from.getTime() - 90 * DAY_MS;
  const out: Retrograde[] = [];
  let current: number | null = moving(start) ? start : null;
  for (let t = start; t <= to.getTime() + 90 * DAY_MS; t += DAY_MS) {
    const retro = moving(t);
    if (retro && current === null) current = t;
    if (!retro && current !== null) {
      const r = {
        planet,
        start: new Date(current),
        end: new Date(t),
        sign: signOfLongitude(planetLongitude(planet, new Date(current))),
        endSign: signOfLongitude(planetLongitude(planet, new Date(t))),
      };
      if (r.end >= from && r.start <= to) out.push(r);
      current = null;
    }
    if (t > to.getTime() && current === null) break;
  }
  return out;
}
