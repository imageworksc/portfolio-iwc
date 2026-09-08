/* ImageWorks Creative — "Our Work"
   Vanilla-JS reimplementation of the Design Compiler logic in
   "Image Works Portfolio.dc.html" (state machine + interactive canvas grids). */
(function () {
  "use strict";

  /* ---------- data ---------- */
  var brandingData = {
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

  var webData = {
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
  var socialData = {
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

  var videoSubs = { "Motion graphics": 1, "Logo animation": 1, "Short video": 1, "Animated ads": 1 };

  // Real filenames extracted from the design bundle (extensions preserved).
  // Paths are relative to the repo root, where index.html lives.
  var imageList = [
    "src/assets/works/img01.jpg", "src/assets/works/img02.jpg", "src/assets/works/img03.webp", "src/assets/works/img04.webp", "src/assets/works/img05.jpg",
    "src/assets/works/img06.webp", "src/assets/works/img07.jpg", "src/assets/works/img08.jpg", "src/assets/works/img09.webp", "src/assets/works/img10.jpg",
    "src/assets/works/img11.jpg", "src/assets/works/img12.jpg", "src/assets/works/img13.jpg", "src/assets/works/img14.jpg", "src/assets/works/img15.jpg",
    "src/assets/works/img16.png", "src/assets/works/img17.jpg", "src/assets/works/img18.jpg", "src/assets/works/img19.jpg", "src/assets/works/img20.jpg",
    "src/assets/works/img21.jpg", "src/assets/works/img22.webp", "src/assets/works/img23.jpg", "src/assets/works/img24.png", "src/assets/works/img25.jpg",
    "src/assets/works/img26.webp", "src/assets/works/img27.webp", "src/assets/works/img28.jpg", "src/assets/works/img29.png", "src/assets/works/img30.jpg"
  ];

  /* ---------- build card sets (mirrors renderVals) ---------- */
  function buildCards(data) {
    var out = [];
    Object.keys(data).forEach(function (s) {
      data[s].forEach(function (p) {
        var play = !!videoSubs[s];
        out.push({ sub: s, title: p[0], desc: p[1], img: !play, play: play, cta: play ? "Watch video" : "View project" });
      });
    });
    return out;
  }
  var brandingCardsAll = buildCards(brandingData);
  var webCardsAll = buildCards(webData);
  var socialCardsAll = buildCards(socialData);

  // Scatter images so neighbours differ — identical formula to the source, and
  // walked in the same order, so splitting the social work off the web set left
  // every card with the image it already had.
  var _gi = 0;
  function assignImg(c) { c.image = imageList[(_gi * 7 + 3) % imageList.length]; _gi++; return c; }
  brandingCardsAll.forEach(assignImg);
  webCardsAll.forEach(assignImg);
  socialCardsAll.forEach(assignImg);

  // Interleave the three lists into one ungrouped grid.
  var allCards = [];
  var sets = [brandingCardsAll, webCardsAll, socialCardsAll];
  var maxLen = Math.max(brandingCardsAll.length, webCardsAll.length, socialCardsAll.length);
  for (var i = 0; i < maxLen; i++) {
    for (var k = 0; k < sets.length; k++) {
      if (sets[k][i]) allCards.push(sets[k][i]);
    }
  }

  /* ---------- svg snippets ---------- */
  var ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';
  var PLAY = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#143C66"><path d="M7 4v16l13-8z"></path></svg>';

  /* ---------- categories ----------
     One mark each, all drawn on the same 24px grid at the same weight: the
     grid of panes, the palette, the screen, and a megaphone for the work that
     runs in a feed or a paid placement. */
  function catIcon(body) {
    return '<svg class="iw-seg__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true">' + body + '</svg>';
  }
  var CATS = [
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
  var state = { filter: "all" };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function cardHTML(card) {
    var play = card.play
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

  var WORKS_INITIAL = 9;   // cards on first paint (3 rows)
  var WORKS_STEP = 9;      // cards revealed per scroll batch
  var moreObserver = null; // watches the sentinel; torn down between renders

  // Fill a works grid in batches, revealing more as the sentinel scrolls into view.
  function setupProgressive(host, cards) {
    if (moreObserver) { moreObserver.disconnect(); moreObserver = null; }
    var grid = host.querySelector(".iw-grid");
    var fade = host.querySelector("[data-fade]");
    var sentinel = host.querySelector("[data-sentinel]");
    if (!grid) return;
    var shown = 0;
    var tmp = document.createElement("div");

    function appendBatch(n) {
      var end = Math.min(shown + n, cards.length);
      for (var i = shown; i < end; i++) {
        tmp.innerHTML = cardHTML(cards[i]);
        var card = tmp.firstChild;
        card.classList.add("reveal");
        card.style.animationDelay = (((i - shown) % WORKS_STEP) * 130) + "ms";
        card.addEventListener("animationend", function () {
          this.classList.remove("reveal");
          this.style.animationDelay = "";
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
          for (var k = 0; k < entries.length; k++) {
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
    var host = document.getElementById("iw-sections");
    var f = state.filter;
    var cards = f === "branding" ? brandingCardsAll
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
  var segEl = null, segBtns = [];

  function buildPills() {
    var row = document.getElementById("iw-filter-row");
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
    segBtns = Array.prototype.slice.call(row.querySelectorAll(".iw-seg__btn"));

    segBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-cat");
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
      var ro = new ResizeObserver(moveFill);
      ro.observe(segEl);
      segBtns.forEach(function (b) { ro.observe(b); });
    } else if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(moveFill);
    }
  }

  function markPills() {
    segBtns.forEach(function (btn) {
      var on = btn.getAttribute("data-cat") === state.filter;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    moveFill();
  }

  // The fill is laid over the active segment from measurement, not from a
  // width the stylesheet could know: the labels are different lengths.
  function moveFill() {
    if (!segEl) return;
    var on = segEl.querySelector(".iw-seg__btn.is-on");
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
    var cv = host.querySelector("canvas");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var GAP = 30, R = 190, MAXPUSH = 30;
    var w = 0, h = 0, mx = -9999, my = -9999, strength = 0, target = 0, raf = 0;

    function resize() {
      var r = host.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var y = GAP / 2; y < h; y += GAP) {
        for (var x = GAP / 2; x < w; x += GAP) {
          var px = x, py = y, ff = 0;
          if (strength > 0.01) {
            var dx = x - mx, dy = y - my, d = Math.hypot(dx, dy);
            if (d < R) {
              ff = 1 - d / R;
              var inv = d || 1, push = ff * MAXPUSH * strength;
              px = x + (dx / inv) * push;
              py = y + (dy / inv) * push;
            }
          }
          var e = ff * strength;
          var eased = e * e * (3 - 2 * e);
          var cr = (52 + 76 * eased) | 0;
          var cg = (92 + 103 * eased) | 0;
          var cb = (134 - 60 * eased) | 0;
          ctx.beginPath();
          ctx.fillStyle = "rgba(" + cr + "," + cg + "," + cb + "," + (0.16 + eased * 0.3) + ")";
          ctx.arc(px, py, Math.max(1.0, 1.9 - eased * 0.9), 0, 6.2832);
          ctx.fill();
        }
      }
    }
    host.addEventListener("mousemove", function (ev) {
      var r = host.getBoundingClientRect();
      mx = ev.clientX - r.left; my = ev.clientY - r.top; target = 1;
    }, { passive: true });
    host.addEventListener("mouseleave", function () { target = 0; }, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    resize();
    (function loop() { strength += (target - strength) * 0.08; draw(); raf = requestAnimationFrame(loop); })();
    void raf;
  }

  /* ---------- boot ---------- */
  function boot() {
    buildPills();
    renderSections();
    document.querySelectorAll("[data-dotgrid]").forEach(initGrid);

    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".iw-nav nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.style.display === "flex";
        nav.style.display = open ? "" : "flex";
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
