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
    ],
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
  var brandingCardsAll = [];
  Object.keys(brandingData).forEach(function (s) {
    brandingData[s].forEach(function (p) {
      brandingCardsAll.push({ sub: s, title: p[0], desc: p[1], img: true, play: false, cta: "View project" });
    });
  });
  var webCardsAll = [];
  Object.keys(webData).forEach(function (s) {
    webData[s].forEach(function (p) {
      var play = !!videoSubs[s];
      webCardsAll.push({ sub: s, title: p[0], desc: p[1], img: !play, play: play, cta: play ? "Watch video" : "View project" });
    });
  });

  // Scatter images so neighbours differ — identical formula to the source.
  var _gi = 0;
  function assignImg(c) { c.image = imageList[(_gi * 7 + 3) % imageList.length]; _gi++; return c; }
  brandingCardsAll.forEach(assignImg);
  webCardsAll.forEach(assignImg);

  // Interleave both lists into one ungrouped grid.
  var allCards = [];
  var maxLen = Math.max(brandingCardsAll.length, webCardsAll.length);
  for (var i = 0; i < maxLen; i++) {
    if (brandingCardsAll[i]) allCards.push(brandingCardsAll[i]);
    if (webCardsAll[i]) allCards.push(webCardsAll[i]);
  }

  var brandingSubOrder = ["Logos", "Visual identity", "Brand refresh", "Collateral", "Style direction", "Campaign look"];
  var webSubOrder = ["Websites", "Landing pages", "UX/UI", "Web animations", "Motion graphics", "Logo animation", "Short video", "Animated ads"];
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  /* ---------- svg snippets ---------- */
  var ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';
  var PLAY = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#143C66"><path d="M7 4v16l13-8z"></path></svg>';
  var CAT_ICONS = {
    all: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect></svg>',
    branding: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 1 0-18c4.97 0 9 3.58 9 8 0 2.5-2 3.5-3.5 3.5H15a2 2 0 0 0-1.5 3.3A1.5 1.5 0 0 1 12 21z"></path><circle cx="7.5" cy="10.5" r="1"></circle><circle cx="12" cy="7.5" r="1"></circle><circle cx="16.5" cy="10.5" r="1"></circle></svg>',
    web: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="14" rx="2"></rect><path d="M8 21h8M12 18v3"></path></svg>'
  };

  /* ---------- state ---------- */
  var state = { filter: "all", sub: null };

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

  function subsHTML(order) {
    return order.map(function (label) {
      var on = state.sub === label ? " on" : "";
      return '<button type="button" class="iw-chip' + on + '" data-sub="' + esc(label) + '">' +
        '<img src="src/assets/icons/' + slug(label) + '.svg" alt="" width="14" height="14">' + esc(label) + '</button>';
    }).join("");
  }

  function gridHTML(cards) { return cards.map(cardHTML).join(""); }

  function renderSections() {
    var host = document.getElementById("iw-sections");
    var f = state.filter, html = "";

    if (f === "all") {
      html =
        '<section class="iw-section all enter"><div class="iw-wrap">' +
          '<div class="iw-grid">' + gridHTML(allCards) + '</div>' +
        '</div></section>';
    } else if (f === "branding") {
      var bCards = state.sub ? brandingCardsAll.filter(function (c) { return c.sub === state.sub; }) : brandingCardsAll;
      html =
        '<section class="iw-section enter"><div class="iw-wrap centered">' +
          '<p class="lead">Logos, visual identity, brand refreshes, collateral, style direction, campaign look-and-feel, and brand-focused static creative.</p>' +
          '<div class="iw-subs">' + subsHTML(brandingSubOrder) + '</div>' +
          '<div class="iw-grid">' + gridHTML(bCards) + '</div>' +
        '</div></section>';
    } else if (f === "web") {
      var wCards = state.sub ? webCardsAll.filter(function (c) { return c.sub === state.sub; }) : webCardsAll;
      html =
        '<section class="iw-section enter"><div class="iw-wrap centered">' +
          '<p class="lead">Full websites, homepage and interior designs, landing pages, UX/UI, interactive sections, website &amp; logo animations, motion graphics, short videos, and animated ads.</p>' +
          '<div class="iw-subs">' + subsHTML(webSubOrder) + '</div>' +
          '<div class="iw-grid">' + gridHTML(wCards) + '</div>' +
        '</div></section>';
    }
    host.innerHTML = html;

    host.querySelectorAll(".iw-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var label = chip.getAttribute("data-sub");
        state.sub = state.sub === label ? null : label;
        renderSections();
      });
    });
  }

  function renderPills() {
    var row = document.getElementById("iw-filter-row");
    var f = state.filter;
    var cats = [
      { id: "all", label: "All work", icon: CAT_ICONS.all },
      { id: "branding", label: "Branding", icon: CAT_ICONS.branding },
      { id: "web", label: "Web &amp; Animations", icon: CAT_ICONS.web }
    ];
    // Selected pill sits in the middle (order 2); others take 1 and 3.
    var others = cats.filter(function (c) { return c.id !== f; });
    var orderOf = {};
    orderOf[f] = 2;
    if (others[0]) orderOf[others[0].id] = 1;
    if (others[1]) orderOf[others[1].id] = 3;

    row.innerHTML = cats.map(function (c) {
      var on = c.id === f;
      return '<button type="button" class="iw-tab ' + (on ? "on" : "off") + '" data-cat="' + c.id + '" style="order:' + orderOf[c.id] + '">' +
        c.icon + '<span>' + c.label + '</span></button>';
    }).join("");

    row.querySelectorAll(".iw-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.filter = tab.getAttribute("data-cat");
        state.sub = null;
        renderPills();
        renderSections();
      });
    });
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
    renderPills();
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
