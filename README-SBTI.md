# MischiefType SBTI Prototype

MischiefType is a premium, entertainment-first SBTI personality-test prototype. It supports English, Kurdish Sorani, and Arabic; English is LTR and Kurdish/Arabic are full RTL routes at `/ckb` and `/ar`.

## Architecture

- `app/[locale]/page.tsx`: localized app route with metadata and hreflang alternates.
- `app/sbti-client.tsx`: interactive homepage, type gallery, test flow, result page, poster generator, local autosave, language/theme/safe-wording controls.
- `lib/sbti.ts`: typed data model, 27 personality definitions, character asset specs, 32 original questions, 15 dimensions, transparent scorer, safe wording, and localized interface copy.
- `tests/*.test.mjs`: production render tests plus scoring, localization, reachability, and safe-wording unit tests.

## Data Model

The prototype models:

- `PersonalityType`
- `CharacterAsset`
- `Question`
- `TestResult`
- `Dimension`
- compatibility fields
- localized profile, SEO, social, and poster copy

The first fully written result is `THIN-K`, including long description, strengths, struggles, advice, roast, chart, compatibility, poster captions, social copy, and multilingual copy. The other 26 types have production-shaped cards and concise localized starter content so the site looks complete while deeper profile writing is finished.

## Scoring

Questions use a seven-point scale. Each active question maps to one of 15 dimensions. Reverse-scored questions invert the answer before dimension normalization. Results are selected by nearest distance between the user's dimension vector and each type's configured profile.

Automated tests verify:

- every one of the 27 results is reachable;
- scoring is deterministic;
- all required locales have type copy and alt text;
- safe wording maps mature codes to public-safe alternatives;
- all 15 dimensions are measured.

## Localization

Routes:

- `/en`
- `/ckb`
- `/ar`

The app persists language locally, sets `html[dir]`, mirrors key layout flows for RTL, keeps type codes inside bidi-isolated LTR spans, and uses localized text for UI, questions, result profiles, social captions, and poster captions.

For production, complete the Kurdish copy review with a native Sorani editor. The current Kurdish text is written naturally for a young audience, but the brief's requested Gemini Pro rewrite pass is not connected in this local prototype.

## Character System

All 27 types include structured character asset specifications:

- code and safe code;
- multilingual titles;
- expression, pose, clothing, prop, accent, and background symbol;
- multilingual alt text;
- generation prompt and negative prompt;
- desktop, mobile, thumbnail, and transparent asset target paths.

The prototype renders original CSS geometric mascots using the same proportions, palette, face structure, and card language. Production can replace the target paths with generated transparent WebP/PNG exports without changing the data model.

## Poster Generator

The result page includes three poster layouts:

- 1080x1920 Story/TikTok;
- 1080x1350 portrait;
- 1080x1080 square.

Downloads are rendered directly to canvas with localized text, not via page screenshots. The user can switch layout, background style, username visibility by leaving it blank, language, and safe/original wording.

## Admin Dashboard Plan

The first delivery does not implement a real backend admin area. The production architecture should add:

- Supabase/PostgreSQL tables for site settings, questions, weights, profiles, translations, character assets, poster templates, and anonymous aggregate events;
- row-level security and role-based access;
- protected admin routes for JSON import/export, translations, question activation, scoring edits, SEO edits, safe-wording defaults, and asset uploads;
- server-side validation for every content change;
- audit logs for admin edits.

Do not expose admin secrets to the frontend. Keep anonymous testing available without registration.

## Privacy And Analytics

The prototype stores only local test progress. A production analytics layer should collect anonymous aggregate events only: test starts, completions, result distribution, language selection, poster downloads, share clicks, device category, and general referrer.

Avoid collecting names, phone numbers, private messages, precise location, or sensitive psychological data unless a user knowingly provides optional display text.

## Finish Remaining Content

To complete all result pages:

1. Expand the 26 starter profiles to match `THIN-K` depth.
2. Commission or generate final transparent character assets from each stored prompt.
3. Add individual static type pages and compatibility pages.
4. Add privacy, terms, cookie, and delete-data pages.
5. Build the authenticated admin dashboard and database schema.
6. Add Playwright end-to-end tests for test completion, resume, poster download, language switch, and result reopening.
7. Run native review for Kurdish Sorani and Arabic tone.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by the dev server.

## Validate

```bash
npm test
```

This runs a production build and all current tests.

## Deploy

This project uses the Sites/Vinext starter and builds with:

```bash
npm run build
```

For production deployment through Sites, save and deploy the built site from this project. If deploying elsewhere, use the generated Worker-compatible `dist` output and configure the host to serve `/en`, `/ckb`, and `/ar`.
