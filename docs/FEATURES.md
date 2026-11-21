# Features

Everything Astro Tree does today, followed by ideas for what could come next.

## Built

### The sky

- **Real constellations.** Twelve zodiac figures from J2000 star coordinates and traditional stick-figure lines, with
  stars sized by apparent magnitude and gently twinkling.
- **A carousel that follows you.** The active sign turns to face the camera, centred in whatever part of the screen
  the panels leave free (side panel on landscape, bottom sheet on portrait).
- **Explore freely.** Drag to orbit, scroll or pinch to zoom; choosing another sign glides the view back home.
- **Today's Moon.** Drawn at its real phase above the constellation it's passing through. Tap it to jump to that
  sign's Today reading.
- **Your constellation in gold** once you've told the app your sign.
- **Tap the active constellation** to open the Tarot Gate from that exact spot.

### The intro

- The zodiac wheel spins and glides (3.2 s exponential ease) to rest with today's Sun sign at the top, chiming like
  a singing bowl if sound is on.
- Brush the stardust aside with a mouse or finger; it drifts away on its own if you just watch.
- Greets returning readers by name and tells them where the Moon is for their sign tonight.
- Plays on every visit to the home page; skipped for deep links, reduced-motion users and `?intro=off`.

### Readings

| | Built from |
| --- | --- |
| Daily reading | The Moon's sign and phase at local noon, as a house counted from your sign (or rising) |
| Sky headline | New/full moons, the Sun changing sign, Mercury/Venus/Mars stations, on the day they happen |
| Tip of the day | Element-specific and universal tips with a closing line; no repeat within three years |
| Lucky number | Numerology: personal day number with a birthday, universal day number without |
| Lucky colour | The weekday's ruling planet, in a shade of your element |
| Your hours | The first daytime planetary hour of your sign's traditional ruler |
| Monthly overview | The Sun's house for most of the month, the date it changes sign, focus and avoid |
| Monthly events | Every new and full moon and retrograde, marked passed / now / upcoming |

Readings never repeat within 1,848 days for a sign, and no single sentence returns within 11 days. See
[ARCHITECTURE.md](ARCHITECTURE.md#how-readings-avoid-repeating) for how.

### Tarot

- **The full deck.** 78 Rider–Waite–Smith cards in high resolution, each with upright and reversed keywords and
  meanings, plus astrological correspondences for the Major Arcana.
- **Each sign's own card,** with a shared-element transition from the panel to a full card page.
- **The Tarot Gate:**
  1. Opens as a portal with a low swell.
  2. Choose a spread: card of the day, past · present · future, or situation · obstacle · advice.
  3. Hold the deck to shuffle it; the cards riffle (with sound) until you let go.
  4. Cut the deck into three piles and choose one.
  5. Pick from a fan; each pick flies into its slot.
  6. Turn each card yourself. The next one breathes; each turn lifts, glows and ticks.
  7. The meanings appear card by card, then notes for your sign: your own card, your element, Major Arcana
     weight, dominant suit, all-upright or all-reversed.
- **Card of the day** is kept until tomorrow, and your recent ones collect in a 30-day strip.
- **Keep this reading.** Any reading becomes a 1080×1920 keepsake image: constellation, date, Moon and cards. It's
  shared through the phone's share sheet, or downloaded.
- **No broken cards.** If an image ever fails to load, the card retries once, then draws a stand-in with its name.

### Personal

- **A welcome dialog.** It asks "Which sky were you born under?" for name, birthday, sun sign (filled in from the
  birthday) and an optional rising sign.
- **Opens on your sign,** greets you by name, uses your rising for houses and your birthday for numerology.
- **All of it stays on the device** (`localStorage`). There is no account and no server.

### Everywhere

- **Every screen size.** Phones, tablets, laptops, landscape and 320 px screens are all tested.
- **Installable** as a Progressive Web App with icons, full-screen launch and offline support.
- **Sound** is optional and off by default, synthesized with Web Audio so there are no audio files.
- **Lighter on the device.** One WebGL canvas for the whole visit, the nebula as a CSS background, the pixel ratio
  capped, and images sized for phones.
- **Accessible.** Keyboard controls (arrows, Escape, Space/Enter to hold the deck), screen-reader labels, focus
  rings and reduced-motion support.

## Ideas for next

These came out of the product and creative reviews but aren't built yet:

- **Vary the shape of the reading.** Change the sentence order on some days and occasionally leave out the phase
  line, so the four-part structure doesn't become predictable.
- **Tighter house focus phrases.** Shorter clauses read more like speech than lists.

And ten more ideas:

1. **Morning notification.** "Your card is waiting." Web Push from the service worker works on Android and on
   installed iOS apps (16.4+); the reading itself is generated on the device.
2. **Point your phone at the sky.** Use the device's orientation sensors to turn the 3D sky as you move the phone,
   so she can find where her constellation actually is tonight.
3. **Tarot journal.** Write a line under each card of the day and look back at the month on the next New Moon,
   with an export to PDF.
4. **Compatibility for two.** A page for "her sign + yours": element harmony, how the signs relate on the wheel,
   and a shared three-card spread with one card each and one between you.
5. **Eclipses and a sky calendar.** Solar and lunar eclipses are computable from the same Moon model; a month grid
   could show lunations, retrogrades and ingresses at a glance.
6. **All the planets in the sky.** Jupiter and Saturn can be added from the same JPL elements, so all the visible
   planets sit in their real signs on the ring.
7. **Birthday season.** On her solar return, a special screen: the year ahead from her personal year number and
   the Sun's return to its birth position, with a one-card spread for the new year.
8. **More spreads.** Celtic Cross, a yes/no card, and a New Moon intention spread that unlocks only on New Moon days.
9. **Shareable reading links.** Encode the drawn cards in the URL so a reading can be sent to a friend and opened as
   the same cards, even on another device.
10. **Seasonal skies.** Tint the nebula and the UI accent with the current Sun sign's element, so the app slowly
    changes colour through the year.
