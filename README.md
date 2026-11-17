# astro-tree

An interactive 3D horoscope built with React Three Fiber. It opens on today's zodiac sign, draws each sign as a
constellation against a nebula sky, and pairs it with a Major Arcana tarot card that expands into a full reading.

## What it does

- **Intro scene.** A spinning zodiac wheel gives way to a field of 5,000 dust particles that scatter away from
  your cursor. Clearing the dust reveals the sky.
- **Constellations.** Each of the 12 signs is a set of 3D star positions joined by lines, rendered over a nebula
  image used as both the scene background and its environment map.
- **Starts on today's sign.** The sign is picked from the current date. Arrow keys or the on-screen buttons cycle
  through the rest.
- **Tarot cards.** Each sign maps to its traditional Major Arcana card (Aries → The Emperor, Pisces → The Moon, …).
  Clicking the card opens `/card/:sign`, and a framer-motion shared-layout transition carries the card into a
  focused view with the sign's reading.

## How it's built

- **Rendering:** three.js through `@react-three/fiber`, with `@react-three/drei` helpers (`Line`, `Html`, `Points`,
  `useEnvironment`)
- **Motion:** framer-motion for route and card transitions; react-spring for 3D animation
- **Routing:** React Router 7 with `AnimatePresence` so route changes animate in and out
- **Tooling:** Vite, TypeScript, ESLint

The wheel's dark background is keyed out at load time: the texture is drawn to a canvas and near-black pixels get
zero alpha, so the wheel floats over the nebula without a separately prepared image.

## Run locally

```sh
npm install
npm run dev
```

## Project layout

```
src/components/      3D scenes: IntroScene, ZodiacWheel, DustField, ConstellationCanvas, NebulaEnvironment
src/features/tarot/  TarotCard and the CardFocus route
src/data/            Constellation coordinates, sign data, sign → tarot card map
src/router.tsx       Animated routes
```
