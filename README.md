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
