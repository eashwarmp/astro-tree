# astro-tree

An interactive 3D horoscope built with React Three Fiber. It opens on the real night sky, with the twelve zodiac
constellations drawn from actual star positions, and gives every sign a reading for today and this month that is
worked out from where the Sun, Moon and planets really are. A tarot gate lets you draw from the full 78-card deck.

## What it does

- **Intro.** A zodiac wheel spins and comes to rest on the sign the Sun is in today, then a cloud of stardust waits
  for you to brush it aside (mouse or finger) to reveal the sky. It plays once per browser session and is skipped
  for reduced-motion users and deep links.
- **The sky.** All twelve constellations sit on a ring, built from J2000 star coordinates with stars sized by
  brightness. The active sign turns to face you, centred in whatever part of the screen the panels leave free.
  Drag to orbit, scroll or pinch to zoom; picking another sign glides the view back. Tap a constellation to select
  it, or tap the active one to open the tarot gate from that spot.
- **Today.** A reading built from the Moon's actual sign and phase that day, counted as a house from the chosen
  sign, plus a tip of the day, a lucky number, colour and power hours, and the card of the day.
- **This month.** Where the Sun spends the month (as a house from the chosen sign), the date it changes sign, every
  new and full moon, and any Mercury, Venus or Mars retrograde, each marked as passed, happening now or upcoming.
- **Tarot.** Each sign's Major Arcana card has its own page. The tarot gate offers three spreads (card of the day,
  past/present/future, situation/obstacle/advice): the deck shuffles, you pick cards from a fan, they fly into place
  and turn over, and the reading combines the cards' upright or reversed meanings with notes for your sign
  (your own card appearing, your element, Major Arcana weight, dominant suit). The card of the day is kept until
  tomorrow.
- **Your sign.** "Make my sign" remembers a sign on this device and opens the sky on it next time.
- **Every device.** Side panel on landscape screens, bottom sheet on portrait ones, safe-area aware, touch friendly,
  and the readings still work if WebGL is unavailable.

## How the readings work

Nothing is fetched from a horoscope service. `src/lib/ephemeris.ts` computes positions locally:

- Sun and Moon from Meeus, *Astronomical Algorithms* (ch. 25 and the main terms of ch. 47).
- Mercury, Venus and Mars from JPL's approximate Keplerian elements (valid 1800–2050), giving their sign and
  retrograde periods.

The tests check these against published events: the 2025 lunations land within about an hour, the equinox and
solstices match, and all three 2025 Mercury retrogrades and the 2026 Venus retrograde land within two days.

The wording is hand-written (`src/data/horoscope/`) and assembled by `src/lib/horoscope.ts`. Each sentence slot
rotates through its own pool, so no sentence returns within 11 days, and because the pool sizes (7, 3, 8, 11) share
no factor, a full reading doesn't repeat for 1,848 days. Tips don't repeat within three years either.

The tarot deck (`src/data/tarot.ts`) has all 78 Rider–Waite–Smith cards with upright and reversed keywords and
meanings. Major Arcana carry their traditional astrological correspondences (Golden Dawn, with the modern outer
planets for The Fool, The Hanged Man and Judgement).

### Exporting the readings

```sh
npm run export:readings -- 2026 3   # start year, number of years
```

writes every daily and monthly reading to `dataset/` as CSV (and JSON, which is git-ignored). The committed
`dataset/daily-2026-2028.csv` and `dataset/monthly-2026-2028.csv` cover 2026 through 2028.

## How it's built

- **Rendering:** three.js through `@react-three/fiber` with `@react-three/drei`. One canvas lives for the whole
  visit; the nebula is a CSS background so the GPU only draws stars and lines, and the pixel ratio is capped at 1.75.
- **Motion:** framer-motion for panels, the shared-element card transition and the tarot gate.
- **Routing:** React Router 7. `/?sign=leo`, `/card/leo` and `/tarot/leo` are all shareable.
- **Tooling:** Vite, TypeScript, ESLint, Vitest.

## Run locally

```sh
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests: ephemeris, readings, tarot, zodiac helpers
npm run build
```

Arrow keys move between signs; Escape closes a card or the tarot gate.

## Project layout

```
src/app/        Router and SkyLayout (the persistent canvas + routed panels)
src/pages/      SignPage, CardPage, TarotGate
src/scene/      3D: SkyCanvas, ConstellationRing, Constellation, CameraRig, intro/ (wheel, dust)
src/ui/         HTML panels: SignPanel, SignNav, IntroHint
src/hooks/      URL sign, intro sequence, keyboard, today's date, remembered sign
src/lib/        ephemeris, horoscope generator, tarot, zodiac and layout helpers (+ tests)
src/data/       signs, constellation stars, tarot deck, horoscope phrase pools
scripts/        export-readings.ts
dataset/        exported readings (CSV)
```
