// Writes every daily and monthly reading for a date range to dataset/ as JSON and CSV.
// usage: npm run export:readings -- [startYear] [years]
import { mkdirSync, writeFileSync } from "node:fs";
import { SIGNS } from "../src/data/signs";
import { dailyHoroscope, monthlyHoroscope } from "../src/lib/horoscope";

const startYear = Number(process.argv[2] ?? new Date().getFullYear());
const years = Number(process.argv[3] ?? 3);
const end = new Date(startYear + years, 0, 1);
const csv = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

const daily = [];
for (let d = new Date(startYear, 0, 1); d < end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
  for (const s of SIGNS) daily.push(dailyHoroscope(s.id, d));
}
const monthly = [];
for (let y = startYear; y < startYear + years; y++) {
  for (let m = 1; m <= 12; m++) for (const s of SIGNS) monthly.push(monthlyHoroscope(s.id, y, m));
}

const dir = new URL("../dataset/", import.meta.url);
mkdirSync(dir, { recursive: true });
const name = `${startYear}-${startYear + years - 1}`;
writeFileSync(new URL(`readings-${name}.json`, dir), JSON.stringify({ daily, monthly }));
writeFileSync(
  new URL(`daily-${name}.csv`, dir),
  [
    "date,sign,moon_sign,moon_phase,moon_house,reading,tip,lucky_number,lucky_color,power_hours",
    ...daily.map((h) =>
      [h.date, h.sign, h.moon.signName, h.moon.phaseName, h.moon.house, h.reading, h.tip, h.lucky.number, h.lucky.color, h.lucky.hours]
        .map(csv)
        .join(","),
    ),
  ].join("\n"),
);
writeFileSync(
  new URL(`monthly-${name}.csv`, dir),
  [
    "year,month,sign,sun_sign,sun_house,overview,focus,avoid,events",
    ...monthly.map((m) =>
      [m.year, m.month, m.sign, m.sun.sign, m.sun.house, m.overview, m.focus, m.avoid, m.events.map((e) => e.text).join(" | ")]
        .map(csv)
        .join(","),
    ),
  ].join("\n"),
);
console.log(`Wrote ${daily.length} daily and ${monthly.length} monthly readings to dataset/ (${name}).`);
