# Chronicle reader v2

Entry: `world/creation.html?entry=cover`. Direct chapter links open reading immediately. WORLD keeps its existing entry and routes through the cover.

`assets/chronicle-data.js` registers the book and approved legends in `window.AvarisChronicles`. Each unit references the existing shared bilingual catalog; canon is not duplicated. Add future approved chapters to this registry, with UI title keys in the same catalog. Contents is generated from the registry. No additional chapters are fabricated.

`assets/chronicle.js` measures the real HTML reading area and paginates at unchanged font sizes. Sequence bundles remain together when they fit. Oversized paragraphs split only at existing whitespace; source offsets allow exact reconstruction. A balanced spread may use a chapter frontispiece. Reading position is encoded in the URL by source key and page number and preserved across language and viewport changes. Language preference uses the existing `avaris.language` localStorage key.

Two pages require width >= 1000px, height >= 740px, and aspect ratio >= 1.3. All other layouts use one page. Body text is 19px on desktop and 18px on phones. Cover opening takes 850ms; a paper overlay carrying copies of the outgoing illustrations turns for 550ms without transforming printed text. Reduced motion bypasses both effects.

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
