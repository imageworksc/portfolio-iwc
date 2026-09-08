# ImageWorks Creative — Portfolio

A clean, standalone implementation of the ImageWorks Creative **Portfolio** page,
built from the Claude Design source `Image Works Portfolio.dc.html`.

The original export was a Design-Compiler template (React runtime + `{{ }}` / `<sc-if>` / `<sc-for>`
templating). This repo reimplements it as plain, dependency-free **HTML + CSS + vanilla JS**.

## Structure

One file per language, and nothing crossing between them: no `<style>` block or
`style=` attribute in the markup, and no styling written from the script.

```
index.html          # the page: hero, filter, grid mount, closing band
css/
└── styles.css      # every rule — tokens, wash, hero, filter, cards, responsive
js/
└── app.js          # the work data, the filter, the progressive grid, the canvas dot-grid
assets/
├── logo.svg, footer-logo.png, map.png   # unreferenced since the nav and footer came out
└── works/          # img01–30 project imagery
```

The one thing `app.js` sets on an element is a pair of custom properties holding
the filter fill's position and width. Those are measurements — they depend on the
rendered label widths, so they cannot be known ahead of time. What they *do* is
decided in the stylesheet.

`css/styles.css` and `js/app.js` are loaded with a `?v=` query. Pages serves both
the page and its assets with `Cache-Control: max-age=600`, and a browser can hold
one while it refetches the other; when markup and CSS change together, that
mismatch renders the page unstyled. Bump `?v=` with any change the two make in step.

## Features

- **Category filter** — a segmented control over `All work` / `Branding` / `Web` / `Social and Ads`, with a fill that slides to the chosen one.
- **Interleaved "All work" grid** — the three sets mixed via the source's image-scatter formula.
- **Progressive grid** — nine cards on first paint, nine more each time the sentinel scrolls into view, each batch revealing on a stagger.
- **Hover cards** — image desaturates and a frosted-glass panel reveals the title + CTA; video work shows a play badge.
- **Page wash** — three drifting washes of brand colour behind the top of the page, carried over from the branding page.
- **Interactive canvas dot-grid** — the closing band's background reacts to the cursor.
- **Responsive** — 3 → 2 → 1 column grid; the filter tightens twice and scrolls sideways below that.

## Running

No build step. Open `index.html` in a browser, or serve the repo root:

```bash
python -m http.server 8000   # then visit http://localhost:8000
```

For GitHub Pages, deploy from the repository root — `index.html` is already there.
