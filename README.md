# Spend Matters — website (v4)

Warm champagne theme · signature wordmark · yarn-sphere WebGL scene · "Fabric" chat guide.
Static site — no build step, no backend.

## Files
- `index.html` — structure, content, Fabric chat markup
- `style.css`  — champagne theme, glass UI, chat styles
- `script.js`  — WebGL scene (cables → rope sphere with small ember core),
                 Fabric scripted chat, magnetic hover
- `favicon.svg` — thread-spool "S" mark

Fonts (Google): Inter, Geist Mono, **Great Vibes** (signature wordmark).
Three.js r128 loads from cdnjs inside index.html.

## Fabric chat guide
Front-end only: scripted questions/answers about the company, ending in a mailto CTA.
No data is collected or sent anywhere. Edit the `TOPICS` object at the top of the
Fabric section in `script.js` to change questions and answers.

## Deploy (GitHub Pages — repo gd-commits/smsolutions-website)
1. "Add file → Upload files" at the repo ROOT (the files, not their folder).
2. Never delete the `CNAME` file.
3. Commit to `main`; Pages redeploys automatically.
4. Hard refresh (Ctrl+Shift+R) or incognito to bypass browser cache.

## Scene tuning (top of script.js)
`STRANDS`/`PTS` density · `CABLES` hero cables · `R` sphere size · `FOLDS` wrinkles ·
`MORPH_SPAN` scroll span of the morph · `CORE_SIZE`/`CORE_ALPHA` ember glow (keep small —
large values blow out to white on the light background).
