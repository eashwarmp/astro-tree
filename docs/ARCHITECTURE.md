# Architecture

## Layout

```
src/
  app/        Router and SkyLayout: the persistent shell (nebula, one WebGL canvas, routed HTML on top)
  pages/      SignPage (panel + nav), CardPage (a sign's own card), TarotGate (the ritual)
  scene/      3D: SkyCanvas, ConstellationRing, Constellation, MoonMarker, CameraRig, intro/ (wheel, dust)
  ui/         SignPanel, SignNav, IntroHint, WelcomeDialog, SoundToggle, TarotImage
  hooks/      URL sign, intro sequence, profile, panel tab, keyboard, today's date
  lib/        ephemeris, horoscope, lucky, tarot, keepsake, sound, sky, zodiac, layout, env, assets, pwa (+ tests)
  data/       signs, constellation stars, tarot deck, horoscope phrase pools
scripts/      export-readings.ts
dataset/      exported readings (CSV)
public/       card art, textures, icons, manifest, service worker
docs/         these documents and screenshots
```

## Routing

| Path | What it shows |
| --- | --- |
| `/` or `/?sign=leo` | The sky and the sign panel. Without `sign`, it opens on the reader's own sign, else today's Sun sign |
| `/card/leo` | Leo's Major Arcana card |
| `/tarot/leo` | The Tarot Gate for Leo |

`SkyLayout` stays mounted across all three, so the canvas, textures and intro state survive navigation. The
active sign is read from the URL in `useActiveSign`.

## The sky

- `ConstellationRing` places the twelve figures on a circle. It turns the ring the short way round to the active
  sign, and centres it in the free area that `lib/layout.ts` computes from the same breakpoint as the CSS (side
  panel when the screen is wider than 6:5).
- `lib/sky.ts` projects each constellation's RA/Dec onto a tangent plane, with east on the left as in the real sky.
- `CameraRig` wraps OrbitControls and glides back home whenever the sign changes.

## How readings are made

1. **Ephemeris** (`lib/ephemeris.ts`):
   - The Sun from Meeus ch. 25 and the Moon from the main terms of Meeus ch. 47, both accurate to a few hundredths
     of a degree.
   - Mercury, Venus and Mars from JPL's approximate Keplerian elements, with retrograde stations refined by
     bisection to within a few hours.
2. **Houses** are whole-sign houses counted from the reader's sign, or from their rising if they gave one.
3. **Daily** (`lib/horoscope.ts`): four sentences, plus a sky headline on event days:
   1. A Moon opener with a house focus.
   2. House advice.
   3. A phase line.
   4. A closer in the sign's voice.
4. **Monthly:** the Sun's majority sign for the month as a house, plus lunations and retrogrades in that month.
5. **Lucky values** (`lib/lucky.ts`):
   - Number: numerology day number.
   - Colour: the weekday's ruler plus your element.
   - Hours: planetary hours from approximate sunrise and sunset. These assume 40°N and solar noon at 12:00 local
     standard time, so they're approximate.

### How readings avoid repeating

Each sentence slot walks its own pool with a stride that shares no factor with the pool size, so a sentence can't
return until its whole pool has been used. The pools are 7 openers, 3 focus phrases, 8 pieces of advice and 11
closers. Those sizes are pairwise coprime, so by the Chinese remainder theorem the combination repeats only every
7 × 3 × 8 × 11 = 1,848 days. Phase lines rotate through the days of each phase. Tips use a stride permutation over
65 × 24 combinations. Tests check all of this over three years for every sign.

## Tarot

- `data/tarot.ts` holds the deck.
- `lib/tarot.ts` handles spreads, the shuffle (crypto-random, about a third of cards reversed), interpretation notes
  and the card of the day, which is stored per sign and date.
- `pages/TarotGate.tsx` is a small state machine: `choose → shuffle → cut → pick → reveal`.
- `lib/keepsake.ts` draws the share image on a canvas and uses the Web Share API, falling back to a download.

## Storage

Everything is local to the device. Nothing is sent anywhere.

| Key | Where | What |
| --- | --- | --- |
| `astro-tree:profile` | localStorage | `{ sign, name?, birthday?: { month, day }, rising? }` |
| `astro-tree:welcome-dismissed` | localStorage | The welcome dialog was closed without saving |
| `astro-tree:daily-card:<sign>:<y>-<m>-<d>` | localStorage | The card of the day (`<cardId>:u` or `:r`) |
| `astro-tree:sound` | localStorage | `on` / `off` |
| `astro-tree:tab` | sessionStorage | The selected panel tab |

## App shell

- `public/manifest.webmanifest`, the icons in `public/assets/icons/`, and `public/sw.js`:
  - Navigations are network-first, falling back to the cached shell offline.
  - Assets are stale-while-revalidate.
  - Bump `VERSION` in `sw.js` to clear old caches.
- Public files are always referenced through `asset("assets/…")` (`lib/assets.ts`) so the app can also be served
  from a sub-path.
- `vercel.json` serves real files first (`handle: filesystem`) and falls back to `index.html` for client routes.

## Quality

- `npm test`: Vitest suites for the ephemeris (against published events), readings (uniqueness, headlines, houses,
  lucky systems), tarot, numerology, keepsake layout helpers and the sound preferences.
- CI (`.github/workflows/ci.yml`) runs lint, tests and a build on every pull request and push to `main`.
- UI changes were checked with Playwright walkthroughs at desktop, laptop, tablet, phone, landscape-phone and
  320 px sizes.
