# Avaris world emblem and favicon v1

The uploaded PNG is preserved byte-for-byte as `assets/branding/avaris-world-emblem-master.png`. This is the world emblem, distinct from Equira's North Star and the homepage wordmark.

Transparent PNG and lossless WebP derivatives remove the cosmic rectangular field through deterministic alpha masks. `scripts/extract-world-emblem.py` selects the source medallion and branch regions, warm metal, ivory, amethyst and blue illustration pixels, protects axial tips, and removes tiny disconnected background fragments. It does not synthesize, recolor, reposition, or redraw image pixels. The PNG retains all original RGB values; only alpha changes. SciPy, NumPy and Pillow are needed to reproduce extraction.

The simplified SVG traces the approved tree-like axis, curved branches, surrounding ring and seven medallion locations. Small kingdom illustrations are represented by seven nodes; individual kingdom emblems are not redrawn. The center has a small amethyst diamond, rather than substituting Equira's North Star. 16/32 PNG files are rasterized from this SVG by Chromium at their actual pixel size. 48 uses ringed nodes and an additional central ring. The ICO contains separate 16/32/48 PNG frames.

180/192/512 use the extracted original art, retaining kingdom illustration detail. SVG and 16/32/48 have a restrained near-black circular backing inside transparent corners; 192/512 use the same circular support. Apple touch 180 uses a plain near-black square so the platform can apply its own shape. No white borders or manually rounded platform corners are added.

All page changes are limited to five favicon/Apple declarations in the document head, with paths relative to the existing page. No stylesheet, page body, lore, map, reader code or wordmark is changed. There is no web-app manifest; 192/512 files are supplied for later use without introducing a PWA.

Run `python scripts/check-branding.py`. Chromium and WebKit tests decode PNG/SVG/ICO, render 16/32 at actual browser-tab scale on light/dark browser-rendered test surfaces, check nested page URLs and the mobile Apple declaration. This environment does not expose a native browser tab strip or physical iOS device; those surfaces have not been visually claimed as tested.
