# Avaris Official Website — Phase 1

Dependency-free, multi-page website skeleton. No invented lore or map geography.

## Preview
Run `python3 -m http.server 8000` in the repository and open http://localhost:8000.

## Structure
8 main pages, 7 kingdom pages, 7 goddess pages, and a 404 page. Shared CSS and progressive enhancement JavaScript live in `assets/`. All links are relative for GitHub Pages subpath hosting.

## GitHub Pages
In repository Settings → Pages, select **Deploy from a branch**, branch **main**, folder **/ (root)**. The expected URL after a successful deployment is https://thegameofavaris-ship-it.github.io/avaris-website/. Private repositories require a GitHub plan that supports Pages for private repositories; otherwise the owner must decide whether to make this repository public.

No build step is required. `.nojekyll` disables Jekyll processing.

## Canonical content
Replace placeholder blocks with approved content only. Hero artwork, concept art, and all map views are intentionally empty. Locator maps must derive from one canonical Avaris map. No demo link should be added until a real release exists.

## Future work
Canonical assets and lore; map interaction; kingdom and goddess visual identities; populated library filters; release integration; page transitions. Current filters work against an empty collection and report that no entries are published.

## EN / TR localization
English is the default. The header switch changes all current interface text, document titles, accessible labels and placeholders in place; proper names remain unchanged. `assets/i18n.js` stores the central keyed EN/TR message catalog. `assets/site.js` applies translations and persists explicit selection in `localStorage` under `avaris.language`. Storage errors are caught; the switch still works for the current page if browser storage is unavailable.

For new lore or documents, add a stable semantic key to the message catalog with `en` and `tr` values and use `data-i18n="your.key"` on its text element. Existing interface source text is bound once to catalog keys. Filters retain stable English option values while their visible labels are translated. No separate language copies or routes are needed.

The global palette uses warm charcoal, ivory and restrained aged brass. Shared CSS variables can later be overridden within kingdom pages without changing the neutral global frame.
