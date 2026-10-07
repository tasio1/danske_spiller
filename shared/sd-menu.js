/* =============================================================================
   SJOVT DANSK — standalone nav drawer (for pages that don't load sjovt.js, e.g. blog)
   Load after sjovt.css, with a .sd-bar already in the markup:
     <link rel="stylesheet" href="../shared/sjovt.css">
     <script src="../shared/sd-menu.js"></script>
   Vanilla, no network, no dependency on the game runtime.
   ============================================================================= */
(function () {
  "use strict";
  var doc = document;
  var scriptEl = doc.currentScript;
  var siteRoot = scriptEl ? scriptEl.src.replace(/shared\/[^\/]*$/, "") : "";  // …/ (site root)
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return mq.matches || doc.documentElement.getAttribute("data-sd-motion") === "off"; }

  var NAV_GAMES = [
    { t: "Adverbier og bindeord", u: "adverbs.html" },
    { t: "Bøjningsværkstedet", u: "boejningsvaerkstedet/index.html" },
    { t: "Dansk Mester", u: "danske-phraser/dansk-mester.html" },
    { t: "Danske Antonymer", u: "danish-antonyms-game.html" },
    { t: "En/Et-træner", u: "en-og-et/index.html" },
    { t: "Forbindeord", u: "forbindenor/Forbindenor.html" },
    { t: "Idiomjægeren", u: "idiomjaeger.html" },
    { t: "Konjunktion Crush", u: "konjunktioner/konjunktioner.html" },
    { t: "Magiske Verber", u: "magiske_verber.html" },
    { t: "Ordstillingsdetektiven", u: "ordstilling-detektiv/index.html" },
    { t: "Præpositionsmester", u: "dansk-praepositioner.html" },
    { t: "Pronomenmysteriet", u: "pronomenmysteriet/index.html" },
    { t: "Sætningsmaskinen", u: "saetningsmaskinen/index.html" },
    { t: "Tidsmaskinen", u: "tidsmaskinen/index.html" },
    { t: "Verb-glosekort", u: "danish_flashcards/danish_flashcards_game/index.html" }
  ];

  function build() {
    if (doc.documentElement.hasAttribute("data-sd-nobar")) return;
    var gamesHTML = NAV_GAMES.map(function (g) {
      return '<a href="' + siteRoot + g.u + '">' + g.t + "</a>";
    }).join("");
    var drawer = doc.createElement("div");
    drawer.className = "sd-drawer"; drawer.id = "sd-drawer"; drawer.hidden = true;
    drawer.innerHTML =
      '<div class="sd-drawer-scrim"></div>' +
      '<div class="sd-drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<button class="sd-drawer-close" type="button" aria-label="Luk menu">✕</button>' +
        '<div class="sd-drawer-section"><h2>Spil</h2>' + gamesHTML + "</div>" +
        '<div class="sd-drawer-section"><h2>Mere</h2>' +
          '<a href="' + siteRoot + 'blog/index.html">Blog</a>' +
          '<a href="' + siteRoot + 'en/index.html">English</a>' +
        "</div>" +
      "</div>";
    doc.body.appendChild(drawer);

    var btn = doc.createElement("button");
    btn.type = "button"; btn.className = "sd-menu-btn";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "sd-drawer");
    btn.setAttribute("aria-label", "Åbn menu");
    btn.innerHTML = '<span aria-hidden="true">☰</span>';
    var bar = doc.querySelector(".sd-bar");
    if (bar) bar.appendChild(btn); else doc.body.insertBefore(btn, doc.body.firstChild);

    var scrim = drawer.querySelector(".sd-drawer-scrim");
    var closeBtn = drawer.querySelector(".sd-drawer-close");
    var isOpen = false;
    function onKey(e) { if (e.key === "Escape") { e.preventDefault(); hide(); } }
    function show() {
      isOpen = true; drawer.hidden = false; void drawer.offsetWidth; drawer.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true"); doc.body.style.overflow = "hidden";
      closeBtn.focus();
      doc.addEventListener("keydown", onKey, true);
    }
    function hide() {
      if (!isOpen) return;
      isOpen = false; drawer.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false");
      doc.body.style.overflow = ""; doc.removeEventListener("keydown", onKey, true);
      if (reduced()) drawer.hidden = true; else setTimeout(function () { if (!isOpen) drawer.hidden = true; }, 220);
      btn.focus();
    }
    btn.addEventListener("click", function () { if (isOpen) hide(); else show(); });
    scrim.addEventListener("click", hide);
    closeBtn.addEventListener("click", hide);
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", build); else build();
})();
