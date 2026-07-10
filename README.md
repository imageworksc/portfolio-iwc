# ImageWorks Creative — "Our Work" Portfolio

A clean, standalone implementation of the ImageWorks Creative **"Our Work"** portfolio page,
built from the Claude Design source `Image Works Portfolio.dc.html`.

The original export was a Design-Compiler template (React runtime + `{{ }}` / `<sc-if>` / `<sc-for>`
templating). This repo reimplements it as plain, dependency-free **HTML + CSS + vanilla JS**.

## Structure

```
src/
├── index.html      # page shell: nav, hero, filter, sections mount, CTA, footer
├── styles.css      # styling, hover-panel transitions, responsive breakpoints
├── app.js          # filter/subcategory state machine + interactive canvas dot-grid
└── assets/
    ├── logo.svg, footer-logo.png, map.png
    ├── works/      # img01–30 project imagery
    └── icons/      # subcategory chip icons
```

## Features

- **Category filter** — `All work` / `Branding` / `Web & Animations`; the active pill grows and re-centers.
- **Subcategory chips** — live-filter the grid within a category.
- **Interleaved "All work" grid** — branding + web work mixed via the source's image-scatter formula.
- **Hover cards** — image desaturates and a frosted-glass panel reveals the title + CTA; video work shows a play badge.
- **Interactive canvas dot-grid** — hero and CTA backgrounds react to the cursor.
- **Responsive** — 3 → 2 → 1 column grid; mobile nav.

## Running

No build step. Open `src/index.html` in a browser, or serve the folder:

```bash
cd src && python -m http.server 8000   # then visit http://localhost:8000
```
