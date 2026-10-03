# Chronicle reader — compact editorial interior v5

Entry: `world/creation.html?entry=cover&v=chronicle-compact-v5`. Existing WORLD route, cover, navigation, reading controls and EN/TR preference remain intact.

## Editorial sequence

Five curated spreads replace the rejected seven-spread interior:

| Spread | Left leaf | Right leaf |
|---|---|---|
| Opening | Approved title and opening prose | Approved continuous panorama through the gutter |
| World and peoples | Kingdoms, land and people with one shared-world scene | All seven parallel sentences, followed by botanical manuscript study |
| Sisters and powers | Sisters introduction, seven currents and powers prose | Approved seven-sister plate, including the accepted copper-haired revision |
| Inheritance and memory | Inheritance sequence, passing hands and generations | Forgotten-name sequence, damaged manuscript/ruins fragment and history/memory prose |
| Closing | Present-day world, road study and surviving truths | Seven-part creed, ancient law, root ornament and final harmony line together |

Illustration-supported paragraphs are placed in natural prose flow, not cards or boxed panels. A paragraph's associated figure follows it onto a continuation page when necessary. Exact source-key/start/end spans preserve all 41 approved bilingual canon units; normal prose may combine existing rhythmic lines without changing their wording. The seven parallel sentences remain individually readable together in the tested laptop spreads.

## Print surface

Times New Roman / Times / serif body prose stays at 16.5px for widths >=1000px and 17px below 1000px, with 1.5 line-height. Opening, final creed and ordinary prose share that scale. No fit-to-text font resizing. Cream paper, warm dark ink, restrained rust headings, thin printed frames and selective drop capitals are retained.

Two-page laptop spreads require width >=1200px, height >=640px and aspect ratio >=1.3. Desktop paper is capped at 680px high. Tablet and mobile viewports use one readable physical leaf. At 1280x720, 1366x768, 1440x900 and 1920x1080 the tested EN/TR layouts contain 10 leaves / 5 spreads. Narrow mobile viewports may introduce continuation leaves at the same body scale; page counts vary with browser font metrics. Images reserve their geometry before decoding so delayed loading does not move the ink.

## Artwork

Two supporting assets in `assets/chronicle-art/compact-v5/` were produced with the built-in image generation tool: one continuous shared-world seven-ways scene and one transparent botanical tree study. See `docs/chronicle-compact-art-prompts.md` for the complete prompts. WebP quality 88 retains the tree alpha; original generated PNGs are untouched.

The approved `interior-v4/opening-panorama.webp` and `interior-v4/sisters-portrait.webp` are reused without modifying their source files. The sisters plate retains all seven figures and the accepted hair revision; its CSS feathers only the outer scenic perimeter. Existing transparent seven-paths, inheritance, damaged-history, roads and final-harmony drawings supply manuscript variation. No official map, new emblem, named character, goddess identity or additional lore was generated.

## Behavior and verification

Opening/closing, next/previous, keyboard arrows, corner turns, single-page swipe, contents, Return to World, fullscreen/fallback and reduced motion are retained. Source-position and artwork-plate anchors survive language changes, reflow, close/reopen and refresh. Language selection uses the existing `avaris.language` localStorage key. Cover markup, approved canon, no-JavaScript fallback and unrelated website pages remain unchanged.

Canon verification reconstructs every exact approved source string. Chromium and WebKit checks cover both languages at nine viewport sizes: 1920x1080, 1440x900, 1366x768, 1280x720, 1024x768, 834x1194, 768x1024, 430x932 and 390x844. Checks include prose-slot overflow, fixed body metrics, horizontal overflow and decoded assets. All five laptop spreads were visually inspected in both languages, with mobile leaves also reviewed. Physical Safari/iOS devices were not available; WebKit engine checks are not a physical-device claim.
