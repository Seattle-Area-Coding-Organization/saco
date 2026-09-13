# SACO

A static Astro website for the Seattle Area Coding Organization.

```sh
npm install
npm run dev
npm run check
npm run preview
```

The build produces `dist/`, ready for a static host. Pages are `/`, `/sacc`, `/sacc/2026`, `/about`, `/sponsors`, and `/join`, plus a custom 404. No server or database is required. The site has not been published.

Edit text, people, sponsor tiers, and external destinations in `src/data/site.ts` and `src/pages/`. Styles are in `src/styles/global.css`. The only client JavaScript handles color preference, closing the mobile menu, and the carousel pause control; FAQs use native HTML disclosures.

`npm run check` builds every page and checks local links/assets, metadata, FAQ rendering, the application destination, and theme/menu behavior. It also checks the client script size. Browser verification is separate.

## Content and assets

- Existing content and destinations were read from [saco.dev](https://saco.dev), including [SACC](https://saco.dev/sacc), [About](https://saco.dev/about), [Sponsors](https://saco.dev/sponsors), and [Join](https://saco.dev/join), on September 7, 2026.
- The three SACO logo originals came from `/Users/paul.wang/Documents/SACO/Logos/`. The supplied shapes and colors are unchanged.
- Sponsor artwork and team portraits came from the user-provided `saco-new/public/sponsors/` and `saco-new/public/team/` folders. All six sponsors retain their source tiers and destination links.
- Event photos came from the user-provided `/Users/paul.wang/Downloads/SACC 2026/` album. Web copies are orientation-corrected, resized/cropped, and compressed; original files are unchanged.
- Home hero: `IMG_5028.JPG`. About-page team photo: `IMG_5140.JPG`. Contest discussion: `IMG_5019.JPG`. Awards: `IMG_5084.JPG`. Between activities: `FullSizeRender 6.JPG`. The album's photo timestamps confirm May 23, 2026.
- Manrope is self-hosted using `@fontsource-variable/manrope`.

SACC 2026 is archived at `/sacc/2026`. Its format, schedule, rules, and local photos live in the dated page, so future events can be added without overwriting that record. `/sacc` is the competition overview and links to past editions. Homepage references to the May 23 event point to the archive. The original [2026 registration form](https://docs.google.com/forms/d/e/1FAIpQLScdr-aDxrZaHumGMvKSUixdmFY9L9Hor2aEvaHHa-31qWTYFw/viewform?usp=publish-editor) is retained here for reference and is no longer offered on the public pages.

The source site listed May 23, 2026 as upcoming despite that date having passed. It also disagrees with itself on prize amounts ($500 in the hero, $40/$20/$10 in the FAQ); those amounts are omitted pending correction. No new dates, attendance statistics, results, sponsors, or team members were invented.

The team application opens the original Google Form directly. There is no replacement form, local submission handling, or pretend success state.

## Design

Logo-led, geometric, understated. Original blue/teal/green marks, a saturated blue accent, charcoal neutrals, Manrope, 5px corners, and selective event photography. The logo appears in the navigation and footer, not the hero. One contest photograph appears on the homepage; the remaining photos have specific roles in the event gallery and team page. Join and Sponsors use content and functional links without decorative photography. Copy is short and there are no decorative arrows.

The homepage sponsor carousel contains only Platinum and Gold sponsors and retains their original colors. Its slow CSS rotation pauses on hover, keyboard focus, or the Pause control. Reduced motion shows a static, horizontally scrollable list. The Sponsors page shows every tier with descending logo sizes: Platinum, Gold, Silver, Bronze. Light-theme artwork uses dark text while retaining brand colors for readability; original assets remain unchanged.

`DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 1` (except the specifically requested sponsor carousel), `VISUAL_DENSITY: 4`. Static pages and native CSS suit this content site; no animation library or client UI framework is needed. Both color themes follow the same layout and can follow the system or an explicit saved choice.

A preliminary Seattle illustration was generated with the built-in image tool before the event album was supplied. It is retained at `output/concepts/seattle-illustration.png` for reference and is not used by the website. Its prompt requested a wide, restrained architectural view of Seattle from Kerry Park, using charcoal, silver, blue #4986FE, and teal #008882, with no text, people, effects, or interface elements. The supplied competition photos are the site's main imagery.
