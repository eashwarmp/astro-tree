# Shipping Astro Tree as an app

## Where it stands

Astro Tree is already an installable **Progressive Web App**:

- **iPhone:** open the site in Safari → Share → Add to Home Screen.
- **Android:** Chrome offers "Install app".

Once installed it launches full-screen with its own icon and works offline. All data stays on the device, so there's
no backend to run or pay for. Hosting on Vercel's hobby plan is free.

## Three ways to go further

| | PWA only (now) | Android via Play Store | iPhone via App Store |
| --- | --- | --- | --- |
| How | The website, installed | Wrap the PWA as a Trusted Web Activity (Bubblewrap) | Wrap in a native shell (Capacitor) |
| Cost | Free | $25 one-time developer fee | $99/year Apple Developer Program |
| Effort | Done | About a day: generate the app, Digital Asset Links, store listing | A few days: Capacitor project, Xcode, signing, review |
| Updates | Instant on every deploy | Instant (it loads the live site) | Web content updates instantly; native shell changes go through review |
| Notifications | Web Push (Android; iOS 16.4+ when installed) | Yes | Yes (native push) |
| Discovery | Share the link | Play Store search | App Store search |

**Recommendation:** start with the PWA, which is free and already done, and share the link. If people love it,
Android via a Trusted Web Activity is the cheapest store presence. Do the App Store last, because Apple is the hard
one.

## The App Store reality

- **Guideline 4.3 (Spam):** Apple names fortune-telling and horoscope apps among saturated categories and rejects
  ones that look like templates. Astro Tree has a real case for being different: a computed ephemeris rather than
  canned text, real constellations, and the tarot ritual. Lead with those in the review notes and screenshots.
- **Guideline 4.2 (Minimum functionality):** a wrapped website must feel like an app. The offline support, profile,
  sound, haptics (add them through Capacitor) and a native share sheet help here.
- **Privacy label:** "Data Not Collected" is accurate today. Keep it true: no analytics without updating the label.
- **Entertainment framing:** a short line in Settings or About, such as "for reflection and entertainment", is
  standard for astrology apps. It keeps reviewers happy without changing the tone of the app.

## Before publishing anywhere

- [ ] **Card back** (`public/assets/tarot/CardBacks.jpg`): its source is unknown. Replace it with an original design
      or a licensed one.
- [ ] **Zodiac wheel** (`public/assets/wheel.png`): it looks like a stock illustration. Confirm its licence or redraw
      it (an SVG wheel would also be sharper).
- [ ] **Nebula background** (`public/assets/nebula.jpg`): its source is unknown. Replace it with a public-domain
      NASA/ESA image or confirm the licence.
- [x] **Tarot card art:** Pamela Colman Smith's 1909 Rider–Waite–Smith illustrations, public domain (see
      [CREDITS.md](CREDITS.md)).
- [x] **Fonts:** Cinzel, Cinzel Decorative and Crimson Pro are under the SIL Open Font License.
- [x] **Horoscope and tarot text:** original writing in this repo.
- [ ] Add a small About screen with credits, the entertainment line and a link to the source.
- [ ] Store screenshots: reuse `docs/screenshots/`. The App Store needs 6.7" and 5.5" iPhone sizes; capture them
      at those viewports.

## Steps for each store

**Android (Trusted Web Activity)**

1. `npx @bubblewrap/cli init --manifest https://astro-tree.vercel.app/manifest.webmanifest`
2. `npx @bubblewrap/cli build`. This produces a signed `.aab`.
3. Serve `/.well-known/assetlinks.json` from the site (Bubblewrap prints its contents) so the app opens without a
   browser bar.
4. Create the listing in the Play Console, upload the `.aab`, and fill in the data-safety form ("no data collected").

**iPhone (Capacitor)**

1. `npm i @capacitor/core @capacitor/cli @capacitor/ios && npx cap init "Astro Tree" com.astrotree.app --web-dir dist`
2. `npm run build && npx cap add ios && npx cap open ios`
3. In Xcode: set the team and signing, add icons and a launch screen, and test on a device.
4. Optional native extras: `@capacitor/haptics` for the card flip, `@capacitor/local-notifications` for a morning
   reminder, and `@capacitor/share`.
5. Archive, upload to App Store Connect, and use TestFlight for friends before submitting for review.

## If it grows

- **Free with a tip jar** suits a personal project.
- **Optional premium** (Celtic Cross, a birth chart from birth time and place, or a tarot journal) would need
  StoreKit / Play Billing in the native builds.
- **Avoid accounts** unless a feature truly needs syncing across devices. "Everything stays on your phone" is a
  selling point for this audience.
