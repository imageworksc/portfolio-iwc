/* ImageWorks Creative — Portfolio
   Vanilla-JS reimplementation of the Design Compiler logic in
   "Image Works Portfolio.dc.html" (state machine + interactive canvas grids).

   Read top to bottom; each part only needs the one above it:

     DATA          the three sets of work, and the image list they draw from
     CARD SETS     those turned into card objects, and interleaved for "all"
     SVG           the two marks that go inside a card
     CATEGORIES    the four filters and their marks
     STATE         one field: which filter is showing
     CARD / SHELL  the markup for a card and for the section around the grid
     PROGRESSIVE   filling the grid in batches as the sentinel comes into view
     SECTIONS      rendering the shell for the chosen filter
     FILTER        building the segmented control, and placing its fill
     DOT GRID      the canvas behind the closing band
     BOOT

   No styling is written from here. The two properties app.js does set on an
   element are measurements — where the filter's fill goes and how wide it is,
   which depend on rendered label widths and cannot be known ahead of time.
   What those numbers do is decided in css/styles.css.

   ES2015 bindings throughout: const unless a name is genuinely reassigned,
   which is only the loop counters and a handful of pieces of mutable state.
   The file stays wrapped in an IIFE rather than becoming a module — a module
   would not load over file://, and opening index.html directly is how the
   README says to run this. */
(function () {
  "use strict";

  /* ---------- data ---------- */
  const brandingData = {
    "Logos": [
      ["Financial brand identity", "Wordmark, monogram, and full identity system for a wealth firm."],
      ["Craft logo & marks", "Primary logo plus a flexible set of secondary brand marks."],
      ["Fintech monogram", "Geometric monogram and lockups for a payments startup."],
      ["Law firm wordmark", "Refined serif wordmark and seal for an established practice."],
      ["Coffee roaster emblem", "Hand-drawn emblem and stamp set for a specialty roaster."],
      ["Fitness studio mark", "Bold, energetic logotype for a boutique fitness brand."]
    ],
    "Visual identity": [
      ["Organic packaging identity", "Identity and packaging direction for a natural foods startup."],
      ["Publishing identity system", "Logo, type pairing, and editorial layout standards."],
      ["Boutique hotel identity", "Full visual language for a boutique hotel group."],
      ["SaaS brand system", "Color, type, and iconography for a B2B platform."],
      ["Museum identity", "Flexible identity for a contemporary art museum."],
      ["Craft soda brand world", "Playful identity system for a craft soda line."]
    ],
    "Brand refresh": [
      ["Healthcare brand refresh", "Modernized palette, type, and logo for a clinic group."],
      ["Regional retail rebrand", "Updated identity for a regional grocery chain."],
      ["Nonprofit refresh", "Warmer, more human identity for a community charity."],
      ["Airline identity refresh", "Streamlined livery and identity modernization."],
      ["Community bank rebrand", "Trust-forward refresh for a community bank."],
      ["University refresh", "Contemporary system for a liberal-arts college."]
    ],
    "Collateral": [
      ["Corporate collateral suite", "Stationery, brochures, and trade-show collateral system."],
      ["Brand social templates", "On-brand static creative kit for evergreen social posts."],
      ["Event print package", "Signage, badges, and programs for a conference."],
      ["Annual report design", "Editorial layout and data visualization for a report."],
      ["Sales deck system", "Reusable presentation templates for the sales team."],
      ["Packaging insert set", "Unboxing cards and insert system for e-commerce."]
    ],
    "Style direction": [
      ["Brand style direction", "Art direction and visual guidelines for premium listings."],
      ["Photography art direction", "Shot lists and styling guide for a campaign."],
      ["Editorial style guide", "Voice, type, and imagery rules for a magazine."],
      ["Product styling", "Set styling and props direction for product shots."],
      ["Seasonal moodboards", "Direction boards for a fashion label's seasons."],
      ["Illustration direction", "Illustration style and usage guidance."]
    ],
    "Campaign look": [
      ["Campaign look-and-feel", "Cohesive visual theme across seasonal campaigns."],
      ["Product launch visuals", "Key visuals and system for a product launch."],
      ["Holiday campaign", "Festive visual world across channels."],
      ["Awareness campaign", "Bold look for a public-awareness initiative."],
      ["Recruitment campaign", "Employer-brand visuals for hiring."],
      ["Rebrand launch look", "Announcement visuals for a rebrand reveal."]
    ]
  };

  const webData = {
    "Websites": [
      ["Product marketing site", "Multi-page site with homepage, pricing, and tours."],
      ["Corporate website", "Full corporate site with careers and newsroom."],
      ["E-commerce storefront", "Conversion-focused storefront and product pages."],
      ["Agency portfolio site", "Case-study-driven site for a creative studio."],
      ["Nonprofit website", "Donation-forward site for a charity."],
      ["Restaurant website", "Menu, reservations, and location pages."]
    ],
    "Landing pages": [
      ["High-converting landing page", "Conversion-focused page for a paid campaign."],
      ["Webinar signup page", "Registration page with speaker highlights."],
      ["App download page", "Store-badge page with feature callouts."],
      ["Lead-gen landing page", "Gated-content page for demand generation."],
      ["Product launch page", "Teaser-to-launch page with a waitlist."],
      ["Event landing page", "Agenda, speakers, and a ticket call-to-action."]
    ],
    "UX/UI": [
      ["Dashboard UX/UI", "Interface design for a financial analytics app."],
      ["Mobile app UI", "End-to-end UI for a fitness tracking app."],
      ["Onboarding flow", "Multi-step onboarding for a SaaS product."],
      ["Admin console", "Data-dense console for an internal tool."],
      ["Booking flow", "Streamlined booking UX for travel."],
      ["Design system UI", "Component library and patterns for a product."]
    ],
    "Web animations": [
      ["Interior page system", "Templated interior pages and component library."],
      ["Interactive scroll section", "Scroll-triggered storytelling on the homepage."],
      ["Hover micro-interactions", "Delightful hover and state animations."],
      ["Animated hero section", "Motion-led hero for a landing page."],
      ["SVG path animations", "Line-draw animations for feature graphics."],
      ["Transitions & loaders", "Page transition and loader system."]
    ],
    "Motion graphics": [
      ["Animated explainer video", "60-second motion piece introducing the product."],
      ["Product feature reel", "Animated highlights of key features."],
      ["Data story animation", "Animated infographic for a report."],
      ["Brand anthem film", "Motion-driven brand story video."],
      ["Tutorial series", "Animated how-to video series."],
      ["Social motion set", "Short animated clips for social."]
    ],
    "Logo animation": [
      ["Animated logo sting", "Short logo reveal for video intros and ads."],
      ["App icon animation", "Launch animation for the app icon."],
      ["Logo loader", "Looping logo animation for loading states."],
      ["Broadcast bumper", "Logo bumper for video content."],
      ["Endcard animation", "Animated logo endcard for ads."],
      ["Mascot reveal", "Animated brand mascot reveal."]
    ]
  };

  // Social and ads: the work that runs in a feed or a placement rather than on
  // a site of its own. Split out of the web set, which keeps sites, landing
  // pages, UX/UI and the animation work.
  const socialData = {
    "Short video": [
      ["Short-form social video", "Edited promo reel with motion titles."],
      ["Testimonial edit", "Customer testimonial video edit."],
      ["Teaser trailer", "15-second teaser for a launch."],
      ["Event recap video", "Event recap with motion titles."],
      ["How-it-works clip", "Concise product walkthrough clip."],
      ["Vertical reel series", "Vertical reel series for social."]
    ],
    "Animated ads": [
      ["HTML5 animated ad set", "Display banner suite with looping animation."],
      ["Social ad set", "Animated ad variants for social feeds."],
      ["Video ad cutdowns", "6/15/30s cutdowns for a campaign."],
      ["Retargeting banners", "Animated retargeting banner suite."],
      ["Interactive rich media", "Expandable rich-media ad unit."],
      ["Story ad set", "Full-screen vertical story ads."]
    ]
  };

  // The groups whose cards are video: they get a play badge and "Watch video".
  const videoSubs = new Set(["Motion graphics", "Logo animation", "Short video", "Animated ads"]);

  // Real filenames extracted from the design bundle (extensions preserved).
  // Paths are relative to the repo root, where index.html lives.
  const imageList = [
    "assets/works/img01.jpg", "assets/works/img02.jpg", "assets/works/img03.webp", "assets/works/img04.webp", "assets/works/img05.jpg",
    "assets/works/img06.webp", "assets/works/img07.jpg", "assets/works/img08.jpg", "assets/works/img09.webp", "assets/works/img10.jpg",
    "assets/works/img11.jpg", "assets/works/img12.jpg", "assets/works/img13.jpg", "assets/works/img14.jpg", "assets/works/img15.jpg",
    "assets/works/img16.png", "assets/works/img17.jpg", "assets/works/img18.jpg", "assets/works/img19.jpg", "assets/works/img20.jpg",
    "assets/works/img21.jpg", "assets/works/img22.webp", "assets/works/img23.jpg", "assets/works/img24.png", "assets/works/img25.jpg",
    "assets/works/img26.webp", "assets/works/img27.webp", "assets/works/img28.jpg", "assets/works/img29.png", "assets/works/img30.jpg"
  ];

  /* ---------- build card sets (mirrors renderVals) ---------- */
  function buildCards(data) {
    const out = [];
    Object.keys(data).forEach(function (s) {
      data[s].forEach(function (p) {
        const play = videoSubs.has(s);
        out.push({ sub: s, title: p[0], desc: p[1], img: !play, play: play, cta: play ? "Watch video" : "View project" });
      });
    });
    return out;
  }
  const brandingCardsAll = buildCards(brandingData);
  const webCardsAll = buildCards(webData);
  const socialCardsAll = buildCards(socialData);

  // Scatter images so neighbours differ — identical formula to the source, and
  // walked in the same order, so splitting the social work off the web set left
  // every card with the image it already had.
  let _gi = 0;
  function assignImg(c) { c.image = imageList[(_gi * 7 + 3) % imageList.length]; _gi++; return c; }
  brandingCardsAll.forEach(assignImg);
  webCardsAll.forEach(assignImg);
  socialCardsAll.forEach(assignImg);

  // Interleave the three lists into one ungrouped grid.
  const allCards = [];
  const sets = [brandingCardsAll, webCardsAll, socialCardsAll];
  const maxLen = Math.max(brandingCardsAll.length, webCardsAll.length, socialCardsAll.length);
  for (let i = 0; i < maxLen; i++) {
    for (let k = 0; k < sets.length; k++) {
      if (sets[k][i]) allCards.push(sets[k][i]);
    }
  }

  /* ---------- svg snippets ---------- */
  const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';
  const PLAY = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#143C66"><path d="M7 4v16l13-8z"></path></svg>';

  /* ---------- categories ----------
     One mark each, all drawn on the same 24px grid at the same weight: the
     grid of panes, the palette, the screen, and a megaphone for the work that
     runs in a feed or a paid placement. */
  function catIcon(body) {
    return '<svg class="iw-seg__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true">' + body + '</svg>';
  }
  const CATS = [
    { id: "all", label: "All work", icon: catIcon(
      '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect>' +
      '<rect x="14" y="3" width="7" height="7" rx="1.5"></rect>' +
      '<rect x="3" y="14" width="7" height="7" rx="1.5"></rect>' +
      '<rect x="14" y="14" width="7" height="7" rx="1.5"></rect>') },
    { id: "branding", label: "Branding", icon: catIcon(
      '<path d="M12 21a9 9 0 1 1 0-18c4.97 0 9 3.58 9 8 0 2.5-2 3.5-3.5 3.5H15a2 2 0 0 0-1.5 3.3A1.5 1.5 0 0 1 12 21z"></path>' +
      '<circle cx="7.5" cy="10.5" r="1"></circle>' +
      '<circle cx="12" cy="7.5" r="1"></circle>' +
      '<circle cx="16.5" cy="10.5" r="1"></circle>') },
    { id: "web", label: "Web", icon: catIcon(
      '<rect x="2.5" y="4" width="19" height="14" rx="2"></rect>' +
      '<path d="M8 21h8M12 18v3"></path>') },
    /* A megaphone, drawn as the cone and one sound arc. It carried a handle
       too, which at 16px only crowded the cone into half the box. */
    { id: "social", label: "Social and Ads", icon: catIcon(
      '<path d="M15 4.5 7 9.5H4.5A1.5 1.5 0 0 0 3 11v2a1.5 1.5 0 0 0 1.5 1.5H7l8 5z"></path>' +
      '<path d="M18.5 9.2a4.2 4.2 0 0 1 0 5.6"></path>') }
  ];

  /* ---------- state ---------- */
  const state = { filter: "all" };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function cardHTML(card) {
    const play = card.play
      ? '<div class="iw-play">' + PLAY + '</div>'
      : "";
    return '' +
      '<div class="iw-card">' +
        '<div class="img">' +
          '<img src="' + card.image + '" alt="" loading="lazy">' + play +
        '</div>' +
        '<div class="iw-panel">' +
          '<div class="iw-panel-title">' + esc(card.title) + '</div>' +
          '<a class="iw-panel-cta" href="#">' + esc(card.cta || "View More") + ARROW + '</a>' +
        '</div>' +
      '</div>';
  }

  // Empty works shell: grid fills progressively, fade hints there's more below.
  function worksHTML() {
    return '<div class="iw-works">' +
             '<div class="iw-grid"></div>' +
             '<div class="iw-fade" data-fade></div>' +
             '<div class="iw-sentinel" data-sentinel></div>' +
           '</div>';
  }

  const WORKS_INITIAL = 9;   // cards on first paint (3 rows)
  const WORKS_STEP = 9;      // cards revealed per scroll batch — the stylesheet
                           // staggers the reveal off this, in .iw-card.reveal
  let moreObserver = null; // watches the sentinel; torn down between renders

  // Fill a works grid in batches, revealing more as the sentinel scrolls into view.
  function setupProgressive(host, cards) {
    if (moreObserver) { moreObserver.disconnect(); moreObserver = null; }
    const grid = host.querySelector(".iw-grid");
    const fade = host.querySelector("[data-fade]");
    const sentinel = host.querySelector("[data-sentinel]");
    if (!grid) return;
    let shown = 0;
    const tmp = document.createElement("div");

    function appendBatch(n) {
      const end = Math.min(shown + n, cards.length);
      for (let i = shown; i < end; i++) {
        tmp.innerHTML = cardHTML(cards[i]);
        const card = tmp.firstChild;
        // The stagger within a batch is the stylesheet's, off :nth-child —
        // every batch is WORKS_STEP long, so a card's place in its batch is
        // its place in the grid, counted in nines.
        card.classList.add("reveal");
        card.addEventListener("animationend", function () {
          this.classList.remove("reveal");
        }, { once: true });
        grid.appendChild(card);
      }
      shown = end;
      if (shown >= cards.length) {
        if (fade) fade.classList.add("hidden");
        if (moreObserver) { moreObserver.disconnect(); moreObserver = null; }
      }
    }

    appendBatch(WORKS_INITIAL);
    if (shown < cards.length) {
      if ("IntersectionObserver" in window) {
        moreObserver = new IntersectionObserver(function (entries) {
          for (let k = 0; k < entries.length; k++) {
            if (entries[k].isIntersecting) { appendBatch(WORKS_STEP); break; }
          }
        }, { rootMargin: "0px 0px 200px 0px" });
        moreObserver.observe(sentinel);
      } else {
        appendBatch(cards.length); // no IO support: show everything
      }
    }
  }

  // The tabs differ only in the cards they carry, so they share one shell.
  function renderSections() {
    const host = document.getElementById("iw-sections");
    const f = state.filter;
    const cards = f === "branding" ? brandingCardsAll
              : f === "web" ? webCardsAll
              : f === "social" ? socialCardsAll
              : allCards;

    host.innerHTML =
      '<section class="iw-section enter"><div class="iw-wrap">' + worksHTML() + '</div></section>';

    setupProgressive(host, cards);
  }

  /* ---------- filter: a segmented control ----------
     Built once and then only re-marked, so the fill slides from one segment to
     the next instead of being thrown away and redrawn in place. */
  let segEl = null, segBtns = [];

  function buildPills() {
    const row = document.getElementById("iw-filter-row");
    if (!row) return;

    row.innerHTML =
      '<div class="iw-seg" role="group" aria-label="Filter work by category">' +
        '<span class="iw-seg__fill" aria-hidden="true"></span>' +
        CATS.map(function (c) {
          return '<button type="button" class="iw-seg__btn" data-cat="' + c.id + '">' +
            c.icon + '<span>' + esc(c.label) + '</span></button>';
        }).join("") +
      '</div>';

    segEl = row.querySelector(".iw-seg");
    segBtns = Array.from(row.querySelectorAll(".iw-seg__btn"));

    segBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-cat");
        if (id === state.filter) return;
        state.filter = id;
        markPills();
        renderSections();
      });
    });

    markPills();
    window.addEventListener("resize", moveFill, { passive: true });

    // The labels are set in a web font, and the first measurement happens
    // before it lands: the segments are still at the fallback's widths, and the
    // fill would be cut to those and never correct itself. Watching the
    // segments catches the reflow when the font arrives — document.fonts.ready
    // does not, since it can resolve before the face is even requested.
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(moveFill);
      ro.observe(segEl);
      segBtns.forEach(function (b) { ro.observe(b); });
    } else if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(moveFill);
    }
  }

  function markPills() {
    segBtns.forEach(function (btn) {
      const on = btn.getAttribute("data-cat") === state.filter;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    moveFill();
  }

  // The fill is laid over the active segment from measurement, not from a
  // width the stylesheet could know: the labels are different lengths.
  function moveFill() {
    if (!segEl) return;
    const on = segEl.querySelector(".iw-seg__btn.is-on");
    if (!on) return;
    segEl.style.setProperty("--fill-x", on.offsetLeft + "px");
    segEl.style.setProperty("--fill-w", on.offsetWidth + "px");
    // Until this runs the active label would be white on nothing, so the
    // stylesheet holds it in navy and only hands it over once there is a fill.
    segEl.classList.add("is-measured");

    // Sliding is enabled a frame after the fill first lands, so the control
    // arrives already formed instead of growing out of the left edge.
    if (!segEl.classList.contains("is-live")) {
      requestAnimationFrame(function () { segEl.classList.add("is-live"); });
    }
  }

  /* ---------- interactive dot grid (hero + CTA) ---------- */
  function initGrid(host) {
    const cv = host.querySelector("canvas");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 24;      // the branding page's dot field pitch
    const R = 190;       // how far the cursor reaches
    const MAXPUSH = 30;  // how far a dot is pushed at the centre of that reach
    let w = 0, h = 0, mx = -9999, my = -9999, strength = 0, target = 0;

    function resize() {
      const r = host.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          let px = x, py = y, ff = 0;
          if (strength > 0.01) {
            const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy);
            if (d < R) {
              ff = 1 - d / R;
              const inv = d || 1, push = ff * MAXPUSH * strength;
              px = x + (dx / inv) * push;
              py = y + (dy / inv) * push;
            }
          }
          // At rest this is the branding page's dot field exactly — white at
          // .07, a 1px dot every 24px. The dots were navy on white before the
          // band took its gradient, and would have been invisible on it. Near
          // the cursor they brighten and swell; that part is this page's own.
          const e = ff * strength;
          const eased = e * e * (3 - 2 * e);
          ctx.beginPath();
          ctx.fillStyle = "rgba(255,255,255," + (0.07 + eased * 0.25) + ")";
          ctx.arc(px, py, 1 + eased * 0.9, 0, 6.2832);
          ctx.fill();
        }
      }
    }
    host.addEventListener("mousemove", function (ev) {
      const r = host.getBoundingClientRect();
      mx = ev.clientX - r.left; my = ev.clientY - r.top; target = 1;
    }, { passive: true });
    host.addEventListener("mouseleave", function () { target = 0; }, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    resize();
    // Runs for the life of the page; the frame id was kept only to be
    // discarded, since nothing ever cancels it.
    const loop = () => {
      strength += (target - strength) * 0.08;
      draw();
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- boot ---------- */
  function boot() {
    buildPills();
    renderSections();
    document.querySelectorAll("[data-dotgrid]").forEach(initGrid);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
