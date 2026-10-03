# Chronicle reader — curated illustrated interior v4

Entry: `world/creation.html?entry=cover`. The existing WORLD entry, routes, cover artwork, opening/closing interaction and reader controls are retained. Direct chapter links open reading immediately.

## Typesetting and grid

`assets/chronicle-interior.css` replaces the rejected v3 interior layer. The existing base and v2 sheets still supply the unchanged cover and physical reader mechanics. Pages use warm cream paper, dark warm ink (#29251f), a thin printed rust frame, restrained rust headings and selective drop capitals. Body prose is Times New Roman / Times / serif, fixed at **16.5px for widths >=1000px** and **17px below 1000px**, with **1.5 line-height**, 8px paragraph gaps and 1em continuing-paragraph indents. Fonts and art never scale to fit content. Opening and final prose use the same body size.

Running heads, folios, inner/outer margins and illustration anchors share one page grid. Desktop/laptop spreads require width >=1000px, height >=640px and aspect ratio >=1.3. Other viewports use one physical page. The two-page opening is one continuous alpha panorama across the gutter, with a clean stable prose region on the left; it becomes a complete panorama within the single-page mobile opening.

Explicit art classes: `HERO_SPREAD_ART`, `LARGE_VERTICAL_ART`, `LARGE_HORIZONTAL_ART`, `SECONDARY_HORIZONTAL_ART`, `SMALL_ORNAMENT`. Geometry depends only on the selected template and responsive page area, never on paragraph length. Paintings remain at opacity 1, with intact aspect ratio and visible pigment.

## Narrative spread blueprints

`assets/chronicle-data.js` registers the book, canon keys, localized art descriptions and **seven manually curated narrative spreads**. Approved prose remains in the shared EN/TR catalog; it is not duplicated or rewritten.

| Beat | Left leaf | Right leaf |
|---|---|---|
| Opening | Chapter I, title, opening prose | Continuous right-dominant panorama extending into the left leaf |
| Land | Seven kingdoms prose and substantial horizontal drawing | Prose beside a large vertical settlement plate |
| Seven ways | Seven parallel lines in normal body type | One connected scene representing all seven ideas |
| Seven Sisters | Sisters introduction as ordinary prose | Full facing-page seven-figure portrait composition |
| Powers / inheritance | Prose beside seven converging currents | Inheritance prose and substantial passing-hands landscape |
| Memory | Deliberate two-image diagonal editorial grid | Present-day roads prose and landscape |
| Final | Witnesses, surviving truths and ancient law | Seven-part closing ornament and final harmony line |

Mobile half-page portrait templates become separate prose and full-art leaves. The memory grid becomes two deliberately arranged single-page compositions. The seven ways remain one text page followed by one complete art page when their prose fits.

`assets/chronicle.js` fills these **predefined prose slots**, not an equal-packing algorithm. Only overflow creates continuation leaves at unchanged type, art, leading and margins. A new paragraph is moved whole rather than unnecessarily split to fill the end of a slot; oversized paragraphs split only at existing whitespace. Source-key/start/end spans retain every exact approved substring. Existing visual sequence breaks are combined into normal paragraphs except the explicitly requested seven parallel lines. Desktop continuation leaves are completed within their narrative beat before the next spread begins. Page count has no fixed target.

## Artwork

Nine new slot-specific WebP plates live in `assets/chronicle-art/interior-v4/`: opening panorama, portrait settlement, coherent seven-ways scene, seven sisters, seven currents, inheritance, history/memory, converging roads and secondary memory-road landscape. Existing world-emerging and final-harmony drawings are retained where they fit the new composition. The old seven cropped mini-scenes and faded small sisters row are not used.

New artwork was made with the built-in image generation tool, using the supplied spread drawing as medium/composition reference. It is anonymous literary interpretation, not official cartography, identified goddess portraits, new emblems or additional canon. See `docs/chronicle-interior-art-prompts.md` for the complete production prompts. Original generated PNGs are untouched; optimized WebP copies use quality 88 and retain panorama alpha. The approved sisters revision changes the right-side blonde hair to copper, keeping one blonde and the far-left crimson-haired figure.

Art occupies reserved slots before decoding, so delayed image loading cannot move prose or change pagination. Current leaves load their art on rendering. During page turns the outgoing illustrations, including the corresponding portion of a panorama, are copied onto the turning paper plane; HTML ink stays static.

## Preserved reader behavior

Controls: next/previous, keyboard arrows, outer bottom corner, single-page horizontal swipe, contents, Return to World, fullscreen with expanded-layout fallback and reduced motion. Swipes exclude screen edges and do not intercept vertical scrolling or pinch zoom. Opening is 850ms, closing 700ms, turning 550ms; reduced motion bypasses these transitions.

Closing preserves the source position and marks `entry=cover` in the same route. Reopening restores that passage. Source-key/fraction anchors survive consecutive language, fullscreen and viewport reflows until a manual page turn; half-open intervals distinguish adjacent text fragments. Artwork-only pages also retain a stable plate identifier, including across refresh and single/spread transitions. The current reading position is encoded by `legend`, `page`, `at` and optional `plate` URL parameters. EN/TR uses the existing `avaris.language` localStorage preference; changing language stays in the same reader.

Open/turn events still expose the existing shared `avaris.map.sound` preference without adding audio playback. Canon wording, hidden-name ambiguity, Mother Nature's identity, official branding and all unrelated pages remain unchanged.

## Verification

`python scripts/check-chronicle-canon.py --baseline FILE` verifies all 41 bilingual canon units and the no-JavaScript fallback. Browser checks reconstruct every exact source string and compare all prose fonts/line-height across EN/TR and nine sizes: 1920x1080, 1440x900, 1366x768, 1280x720, 1024x768, 834x1194, 768x1024, 430x932, 390x844. Overflow checks include each individual prose slot. Chromium and WebKit are both checked; differing font metrics may create different continuation counts. At 1440x900 both locales have 14 leaves in each tested engine. Physical Safari/iOS devices were not available.

Interaction checks cover cover/open/close/reopen, arrows, language and plate position, refresh preference, fullscreen, reduced motion, contents, World exit and mobile swipe (including native Chromium touch). Visual inspections cover every desktop and mobile narrative composition and decoded assets; illustrations remain fully visible and prose static. Delayed-image tests verify unchanged ink positions.
