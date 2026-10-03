# Chronicle reader — print composition v3

Entry: `world/creation.html?entry=cover`. Direct chapter links open reading immediately. WORLD keeps its existing entry and routes through the cover.

`assets/chronicle-data.js` registers the book and approved legends in `window.AvarisChronicles`. Each unit references the existing shared bilingual catalog; canon is not duplicated. Add future approved chapters to this registry, with UI title keys in the same catalog. Contents is generated from the registry. No additional chapters are fabricated.

`assets/chronicle.js` measures the real HTML reading area and paginates at unchanged font sizes. Sequence bundles remain together when they fit. Oversized paragraphs split only at existing whitespace; source offsets allow exact reconstruction. Each chapter keeps its illustrated opening leaf; page count flows naturally. Reading position is encoded in the URL by source key and page number and preserved across language and viewport changes. Language preference uses the existing `avaris.language` localStorage key.

Two pages require width >= 1000px, height >= 740px, and aspect ratio >= 1.3. All other layouts use one page. Body text is fixed at 16.5px for viewport widths of 1000px and above, and 17px below 1000px, including phones; line-height is 1.5 in every mode. Cover opening takes 850ms; a paper overlay carrying copies of the outgoing illustrations turns for 550ms without transforming printed text. Reduced motion bypasses both effects.

Controls: buttons, left/right arrows, outer bottom corner, and horizontal single-page swipe. Swipes exclude screen edges and do not intercept vertical scrolling or pinch zoom. Contents and Return to World remain available. Fullscreen uses the native API with an expanded-layout fallback; Escape exits fallback mode.

Illustration entries accept `anchor`, `src`, `placement`, `height`, and localized `altKey`, with optional normalized `crop` and `sourceAspect` for atlas scenes. Placements: corner, margin, vignette, edge, inline half-page, full-page. Inline illustrations participate in pagination. Nine optimized transparent WebP assets ship in v2, with fifteen narrative placements. The seven-ways atlas supplies seven independently cropped sketches. `treatments` reserves static manuscript treatment hooks without revealing or explaining hidden canon. Open/turn events (`avaris:chronicle-open`, `avaris:chronicle-turn`) expose the existing shared `avaris.map.sound` preference; no sound files or playback are added.

Validation: `python scripts/check-chronicle-canon.py` checks all 41 canon units and the no-JavaScript fallback. `--baseline FILE` additionally compares both locales against a pre-change catalog. Chromium and WebKit engine checks cover 1920x1080, 1440x900, 1366x768, 1280x720, 1024x768, 834x1194, 768x1024, 430x932, 390x844: both languages, exact text reconstruction, overflow, font sizes, and static ink. Interaction checks cover opening, keyboard, language position, persistence, fullscreen, swipe, reduced motion, contents, and World navigation. WebKit is an engine check, not physical Safari-device testing.


## Physical manuscript pass

`assets/chronicle-v2.css` layers physical leather, restrained cover stamping, page block, gutter shading and narrower reading measure onto the existing reader. The approved transparent world emblem is referenced directly without changing its artwork. Open-book width is limited to 85vw and a height-dependent proportion on large screens; outer manuscript rails give the seven small narrative scenes room. Body text remains static real HTML.

Illustrations are original historical manuscript interpretations, not approved goddess portraits or canonical maps. They use imperfect graphite/ink, dry-brush earth pigment and transparent unfinished edges blended into paper. There are no embedded canon text, invented names, identifiable talisman designs or Mother Nature portrait. Only the far-left sister's hair was changed to red at the user's request; the other six were retained.

| Asset | Passage anchor | Placement |
|---|---|---|
| world-emerging | 00.00 | opening vignette |
| settlement | 02.00 | landscape between text sections |
| seven-ways | 04.00–04.06 | seven outer-margin scenes; inline vignettes on single pages |
| seven-sisters | 07.00 | substantial anonymous seven-figure drawing |
| seven-paths | 11.00 | seven streams/roots converging |
| inheritance | 13.00 | restrained passing-hands drawing |
| history-memory | 16.00 | abraded record fragment and quieter paper |
| converging-roads | 18.00 | anonymous travel/trade vignette |
| final-harmony | 21.00 | spare seven-part ornament |

The art height is reserved before images decode, so image loading does not change pagination. Only currently rendered leaves have image elements; later page art loads lazily. Atlas crops share one cached asset. On single-page layouts, marginal sketches enter the measured reading flow. Illustration/first-paragraph pairs stay together when possible; text may split only at existing whitespace.

Close Book is distinct from Return to World. Closing changes the physical reader state to cover, preserves the current source position and marks `entry=cover` in the same route. Reopening restores that position. Changing language or viewport while closed also preserves the passage. The closing transition is 700ms; reduced motion is immediate. A page-boundary anchor uses a half-open source interval to avoid moving to the previous fragment on resize. Absolute page-corner decoration does not participate in grid sizing.

Validated EN/TR text reconstruction across nine viewport sizes in Chromium and WebKit, along with decoded illustrations, opening/closing/reopening, keyboard, language preference, fullscreen/expanded mode, reduced motion, contents and World exit. Chromium also checks native touch swipe. Physical iOS/Safari devices were not available.


## Print typography and composition lock

`assets/chronicle-print.css` is a reader-only typesetting layer. The approved cover CSS, nine WebP illustrations, registry and bilingual canon catalog are unchanged. The Narnia photographs were used only to assess print density, image/prose relationships and chapter hierarchy; no artwork or page design was copied.

All HTML body paragraphs, including the opening, sequences and closing law, inherit the same fixed font size within a width breakpoint. No body `vw`/`clamp`, page-specific sizes or fitting scale exist. Fullscreen and spread/single transitions use the same width breakpoints. The paginator copies computed metrics only to offscreen measurement nodes, never to rendered ink.

Normal text fills the available page grid up to 58ch, with 66px outer and 34px gutter margins on spreads; single pages use 35px side margins and phones 25px. Warm printed ink is #28221b. Paragraph gaps are 4px, continuing prose indents by 1.15em, and major narrative breaks get 9px of space. Opening paragraphs, illustration-adjacent prose, sequence passages, paragraph continuations across pages and first paragraphs on a leaf do not indent. Running heads and folios retain their shared grid and smaller scale.

The chapter opener remains heading → approved landscape → opening prose, on its own leaf. Normal paragraphs can flow into the available remainder of a leaf at existing whitespace, with a two-line/short-tail guard. There is no target page count. A heading-only page is no longer inserted to make spread counts even; a naturally odd final leaf leaves its facing paper empty.

Settlement, seven flowing powers, inheritance, damaged history and converging roads use reserved-size floating vignettes in the prose block. They face the outer side on desktop and wrap at smaller single-page sizes. The seven ways use their existing atlas crops: small varied outer-margin positions on spreads, and 78×54px floated sketches on single pages. Illustrations stay with the beginning of the associated passage rather than being stranded at the previous page end. The seven ways may flow across leaves as the available paper dictates. The opening landscape and important seven-sisters moment retain larger centered drawings.

The source passage anchor survives consecutive language, fullscreen and viewport reflows until the visitor turns a page. This avoids reanchoring to an earlier paragraph merely because it became visible on the facing leaf. Closing/reopening and route behavior remain the existing system.

Chromium and WebKit tests reconstruct all 41 approved EN/TR units across the nine documented viewport sizes; they also compare every body paragraph's computed size and line-height. At 1440×900 both locales produce 6 leaves in both tested engines. At 390×844 Chromium produces 8 in each locale and WebKit 7; differing font metrics are expected. Fixed typography determines pagination. Native touch, keyboard, fullscreen, close/reopen, language persistence, image/ink collision and static-text checks accompany the reflow tests.
