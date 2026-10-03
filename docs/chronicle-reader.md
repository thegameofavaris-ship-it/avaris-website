# Chronicle reader v1

Entry: `world/creation.html?entry=cover`. Direct chapter links open reading immediately. WORLD keeps its existing entry and routes through the cover.

`assets/chronicle-data.js` registers the book and approved legends in `window.AvarisChronicles`. Each unit references the existing shared bilingual catalog; canon is not duplicated. Add future approved chapters to this registry, with UI title keys in the same catalog. Contents is generated from the registry. No additional chapters are fabricated.

`assets/chronicle.js` measures the real HTML reading area and paginates at unchanged font sizes. Sequence bundles remain together when they fit. Oversized paragraphs split only at existing whitespace; source offsets allow exact reconstruction. A balanced spread may use a chapter frontispiece. Reading position is encoded in the URL by source key and offset and preserved across language and viewport changes. Language preference uses the existing `avaris.language` localStorage key.

Two pages require width >= 1000px, height >= 740px, and aspect ratio >= 1.3. All other layouts use one page. Body text is 19px on desktop and 18px on phones. Cover opening takes 850ms; a blank paper overlay turns for 550ms without transforming printed text. Reduced motion bypasses both effects.

Controls: buttons, left/right arrows, outer bottom corner, and horizontal single-page swipe. Swipes exclude screen edges and do not intercept vertical scrolling or pinch zoom. Contents and Return to World remain available. Fullscreen uses the native API with an expanded-layout fallback; Escape exits fallback mode.

Future illustration entries accept `anchor`, `src`, `placement`, and `altKey`. Placements: corner, margin, vignette, edge, inline half-page, full-page. Inline illustrations participate in pagination. No illustration assets ship in v1. `treatments` reserves static manuscript treatment hooks without revealing or explaining hidden canon. Open/turn events (`avaris:chronicle-open`, `avaris:chronicle-turn`) expose the existing shared `avaris.map.sound` preference; no sound files or playback are added.

Validation: `python scripts/check-chronicle-canon.py` checks all 41 canon units and the no-JavaScript fallback. `--baseline FILE` additionally compares both locales against a pre-change catalog. Chromium and WebKit engine checks cover 1920x1080, 1440x900, 1366x768, 1280x720, 1024x768, 834x1194, 768x1024, 430x932, 390x844: both languages, exact text reconstruction, overflow, font sizes, and static ink. Interaction checks cover opening, keyboard, language position, persistence, fullscreen, swipe, reduced motion, contents, and World navigation. WebKit is an engine check, not physical Safari-device testing.
