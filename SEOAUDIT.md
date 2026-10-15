# SEO audit: sjovtdansk.dk

Read-only static audit of the repo, 2026-10-15 (branch `fix/article-skill-digit-keyword`). No files were changed except this one and no network requests were made.

**Method.** I parsed the 29 HTML files that `scripts/build-dist.sh` actually deploys. Excluded: `.claude/`, `docs/`. Extracted values come from the static HTML source only (regex parse, not a rendering browser). "Words" means visible text in the static HTML with `<script>`, `<style>` and `<noscript>` removed, so text injected by JavaScript is not counted.

---

## 1. Summary

- The foundation is better than typical for a hobby site. Every real page has a unique title (≤59 chars), a unique description (142–155 chars), one h1, a self-referencing canonical, a viewport tag, OG title/description, valid JSON-LD that parses, correct `lang`, and `.htaccess` forces https and non-www. There are no `noindex` tags anywhere.
- The English guides and blog posts (550–810 words each) are solid, crawlable content with Article, FAQPage and BreadcrumbList markup. Hreflang is correct and reciprocal on the 12 pages that have a language twin.
- **Top problem 1: the 15 game pages are almost empty HTML.** 13 of 15 have under 150 words in the source (2 to 102), the rest is built by JavaScript, and there is no `<noscript>` anywhere. Google has little to rank except the title and description.
- **Top problem 2: no social image and no favicon.** There is no `og:image`, no Twitter card, and no `<link rel="icon">` on any page, so shares are bare and `/favicon.ico` probably 404s.
- **Top problem 3: the games do not link to the guides, and 5 games have no guide or blog link at all.** Game pages have a single outbound link (`← MENU`), so the Danish-language game pages, the ones that should rank for Danish queries, get no topical support from the English guides and pass nothing on.
- Smaller issues: `pixel-animation.html` is deployed, indexable and unfinished; sitemap `<lastmod>` values lag git; no 404 page, no compression or cache headers in `.htaccess`.

---

## 2. Prioritised issue list

| ID | Severity | Area | Issue | Affected files | Recommended fix | Effort |
|---|---|---|---|---|---|---|
| S01 | High | Content | Game pages have no crawlable explanatory text. 13 of 15 have <150 words in source (danske-phraser 2, tidsmaskinen 13, idiomjaeger 16, pronomenmysteriet 18, saetningsmaskinen 19, boejningsvaerkstedet 24, forbindenor 37, dansk-praepositioner 36, flashcards 44, ordstilling-detektiv 77, magiske_verber 93, adverbs 97, konjunktioner 102). The rest is rendered by JS. | all game pages (see §4) | Add a static 100–200 word block per game under the game shell: what it trains, CEFR level, 3–4 example sentences, a link to the matching guide. Keep it in the HTML, not injected. | L (14 pages) |
| S02 | High | Social | No `og:image`, no `twitter:*` tags on any page. | all 28 real pages | Create one 1200×630 PNG/JPG (and optionally per-section variants), add `og:image`, `og:image:width/height/alt`, `og:site_name`, `twitter:card=summary_large_image`. Add the file to the `shared/` allowlist dir so it deploys. | M |
| S03 | High | Technical | No favicon of any kind: no `<link rel="icon">` anywhere, and no `favicon.ico`, PNG or SVG in the repo. | all pages | Add an SVG/PNG favicon (a Sjovt sprite works) in `shared/`, plus `apple-touch-icon`; link it from every page head. | S |
| S04 | High | Internal linking | Game pages link only to the home page (`← MENU`). 0 links to blog or `/en/` guides from any game. 5 games get no guide or blog link at all: adverbs, boejningsvaerkstedet, danish-antonyms-game, flashcards, idiomjaeger. | all game pages, `shared/sd-menu.js` or per-page nav | Put the "learn the rule" link in the static explanatory block from S01 (descriptive anchor, e.g. "Læs om V2-reglen"). Link related games to each other. | M |
| S05 | Medium | Indexability | `pixel-animation.html` is deployed (`cp ./*.html` in `scripts/build-dist.sh:15`) but is a scratch page: title "Pixel Animation", no description, no h1, no canonical, no OG, 5 words. Not in sitemap, no inbound links. | `pixel-animation.html`, `scripts/build-dist.sh` | Remove it from the deploy (move to `docs/` or add an exclusion) or add `<meta name="robots" content="noindex">`. | S |
| S06 | Medium | Rendering | No `<noscript>` fallback on any page. Game start screens are empty shells until JS runs (e.g. `tidsmaskinen/index.html:212-239` holds empty `#mode-list`, `#level-list`, `#pace-list`). | all game pages | Add a short `<noscript>` message plus the S01 text. Also fix the homepage's `${g.url}` template literal (see S09): the static cards already work as a fallback, good. | S |
| S07 | Medium | Sitemap | `<lastmod>` is stale vs git for 19 of 28 URLs (e.g. `index.html` sitemap 2026-10-02, last commit 2026-10-15; games 2026-10-02 vs 2026-10-06; blog 2026-10-06 vs 2026-10-07). Some of those commits may be non-content changes, so the git date is an upper bound. | `sitemap.xml` | Generate `lastmod` in `build-dist.sh` from git, or update by hand only on real content changes. Drop `<priority>` (Google ignores it). | S |
| S08 | Medium | International | `x-default` for the English guide ↔ game pairs points to the **Danish game** (e.g. `en/danish-pronouns` x-default = `pronomenmysteriet/index.html`). Valid and consistent, but sends non-matching-language users to a game with almost no text. Also `dansk-praepositioner.html` x-default is itself. | 12 pages with hreflang | Decide intent. For a global audience, consider x-default = the English guide for those pairs. Low risk either way. | S |
| S09 | Medium | Titles/H1 | H1 differs from the title keyword on several games: adverbs.html (title "Adverbier og bindeord…", h1 "Sætningsbyggeren"), en-og-et (title "En eller et?…", h1 "Ordenes Vidunderland"), forbindenor (title "Forbindeord…", h1 "FORBINDEORD" in all caps), boejningsvaerkstedet (h1 "Bøjnings&shy;værkstedet" with soft hyphen). Soft hyphens (`&shy;`) in the h1 of 3 pages can break exact matching in some crawlers. | the listed pages | Align h1 with the searched topic (keep the game name as a sub-line). Remove `&shy;` from h1 text and use CSS `hyphens:auto` instead. | S |
| S10 | Medium | Performance | Scripts in `<head>` are not deferred on all game pages and the homepage (`shared/sjovt.js` 41 KB, plus `dansk-core.js` 36 KB and an inline 20–88 KB script on most). Only blog pages use `defer` (for `sd-menu.js`). Several pages load 4–5 CSS files. | game pages, `index.html:19` | Add `defer` to external scripts that do not need to run before parse. Combine or inline critical CSS. Measure with Lighthouse first (not verifiable here). | M |
| S11 | Medium | Server | `.htaccess` has no compression (`mod_deflate`), no `Cache-Control`/`Expires`, no `ErrorDocument 404`. | `.htaccess` | Add deflate for html/css/js/json/svg, long cache for `shared/fonts/*` and versioned assets, and a custom 404. | S |
| S12 | Medium | Content | No 404 page in the repo. | repo root | Add `404.html` (noindex, links to home, games and guides) and point `ErrorDocument` at it. | S |
| S13 | Low | Structured data | `FAQPage` on the 5 English guides: Google restricts FAQ rich results to government and health sites since 2023, so there is no SERP benefit; it is harmless and still readable by other engines. Article JSON-LD lacks `image` (recommended) and uses an Organization author. | `en/*/index.html` | Keep. Add `image` once S02 exists. Optionally add a named person author for E-E-A-T. | S |
| S14 | Low | Structured data | Game pages use `LearningResource` with `name`, `description`, `teaches`, `educationalLevel`, `inLanguage`, free access. Good. Missing `image`, `datePublished`/`dateModified`, `isPartOf` linking to the site. | game pages | Add `isPartOf` → WebSite and `dateModified`; add `image` after S02. | S |
| S15 | Low | URLs | URL hygiene: `forbindenor/Forbindenor.html` has an uppercase `F` (case-sensitive on Apache; `/forbindenor/forbindenor.html` would 404), `danish_flashcards/danish_flashcards_game/index.html` uses underscores and is nested 2 deep, `magiske_verber.html` uses an underscore. Mixed styles `…/index.html` vs `….html`. | those 3 URLs | Changing URLs costs rankings. Only do it if you add 301s in `.htaccess` and update canonical, sitemap, hreflang, JSON-LD and links together. Otherwise leave as is. | M |
| S16 | Low | Canonicals | Canonicals and sitemap consistently use explicit `/index.html` URLs (except the homepage `/`). `/en/` and `/en/index.html` both resolve on Apache, but the canonical tag covers it. Consistent, no action required. | – | Optional: keep linking only to the canonical form. | – |
| S17 | Low | Accessibility/HTML | Game pages contain three `<main>` elements (`#start-screen`, `#play-screen`, `#summary-screen`) in `tidsmaskinen/index.html`, `pronomenmysteriet/index.html`. Only one `main` is valid HTML. | game pages | Use `<section>` for the screens and a single `<main>`. | S |
| S18 | Low | Internal linking | Generic anchors dominate: "← MENU" (26), "blog" (23), "← all posts". Game cards on the homepage are descriptive (`<h3>` game name + tags). Blog and guide cross-links use descriptive titles. | `shared/sd-menu.js`, nav | Rename "← MENU" to "← Alle spil" / "Sjovt Dansk – alle spil"; give guide→game CTAs descriptive text beyond "Play X →". | S |
| S20 | High | Internal linking | `saetningsmaskinen/index.html` is not linked from the homepage or `/en/index.html`: `index.html:232-245` has 14 cards and none is Sætningsmaskinen (0 matches for "saetningsmaskinen" in `index.html` and `en/index.html`; the JS `games` array at `index.html:273` should be checked too). Its only inbound links are `blog/ikke-in-subordinate-clauses` and `en/danish-word-order`. It is in the sitemap, so not a true orphan, but users and link equity barely reach it. | `index.html`, `en/index.html` | Add the card to the homepage static HTML and `games` array, and to the `/en/` game list. | S |
| S19 | Low | Content | Title format `… | Sjovt Dansk` is consistent; all titles ≤59 chars and all descriptions ≤155. Titles at 58–59 chars (har-or-er 59, og-fordi 59, idiomjaeger 59) are right at the limit and may truncate on mobile. | 3 pages | Optional trim to ≤57. | S |

Sorted by severity, then effort within each tier is approximate (S01 first because of the impact; S03, S05 are the cheapest high-value fixes).

---

## 3. Per-area findings

### 3.1 Indexability and crawling

- **noindex / nofollow / X-Robots-Tag:** none found in any HTML (`grep` over all tracked `.html`). `.htaccess` sets no `X-Robots-Tag`. There is no `_headers`, `netlify.toml`, `vercel.json`, `_redirects` or `CNAME`, and hosting is Apache (see `.htaccess:1`, `scripts/deploy.sh`).
- **robots.txt:** `User-agent: *` / `Allow: /` plus `Sitemap: https://sjovtdansk.dk/sitemap.xml`. Correct. It does not block `/shared/` (needed for rendering), which is right.
- **sitemap.xml:** 28 URLs, all `https://sjovtdansk.dk/…`, all exist on disk (checked each `<loc>`). Every deployed real page is in the sitemap. Only `pixel-animation.html` is not (S05). Uses `<lastmod>` and `<priority>`; lastmod is stale for 19 URLs (S07). No hreflang annotations in the sitemap (they are in HTML instead, which is fine as long as only one method is used).
- **Canonicals:** present and self-referencing on all 28 real pages and equal to the sitemap URL. Homepage canonical is `/`, every other page uses its explicit file path. Consistent. Missing only on `pixel-animation.html`.
- **Orphans:** the only page with zero inbound links is `pixel-animation.html`. Every real page is reachable by plain `<a href>`. 14 of 15 game cards on the homepage are static anchors (Sætningsmaskinen is missing, see S20) in the HTML (`index.html:232-245`), then re-rendered by JS from a `games` array (`index.html:273`), so crawlers do not depend on JS. The one "broken link" my checker reported (`index.html` → `${g.url}`) is a JS template literal at `index.html:310`, not a real link.
- **Host/protocol:** `.htaccess` redirects http→https (guarded by `X-Forwarded-Proto`) and `www`→apex with 301s, and `en og et/` → `en-og-et/`. Everything in canonicals, sitemap, hreflang and JSON-LD uses `https://sjovtdansk.dk`. No mixed protocols found. Order of rules: https rule first, then www; a request for `http://www.…` is redirected to `https://sjovtdansk.dk` in one hop, good.

### 3.2 On-page basics

See the inventory in §4. Summary:

- **Titles:** 28/28 present, unique, 50–59 chars. None over 60.
- **Descriptions:** 27/28 present, unique, 142–155 chars. None over 155.
- **H1:** exactly one on every real page. Mismatches with the title topic on 3 games (S09).
- **lang:** `da` on Danish pages, `en` on `/en/` and `/blog/`. Matches the content language. The homepage links to English pages with `lang="en"` on the anchors, which is correct.
- **Thin pages:** 13 game pages under 150 words (S01). `blog/index.html` (173) and `en/index.html` (354) are index pages and acceptable. `danish-antonyms-game.html` (163) and `en-og-et/index.html` (153) are just above the line.

### 3.3 Content and rendering

- **Guides and blog:** full content is in the HTML source (no JS needed to read it). Quiz widgets are progressive (`blog/quiz.js`).
- **Game pages:** the shell is static, but everything meaningful (mode lists, levels, questions, results) is injected by JS (`#mode-list`, `#item-host` etc.). Data lives in `data.js` and `shared/data/*.js`. The explanation text that exists is in the explainer modal (`shared/explainer/modal.js`), which is also JS-driven. So the crawlable text per game is the title, description and a few words.
- **noscript:** zero `<noscript>` blocks in any page.
- **Duplicate content:** no duplicate titles, descriptions or h1s across pages (checked programmatically). Danish game pages and English guides cover the same grammar in different languages, which is intentional and correctly paired with hreflang. No near-duplicate pages found.

### 3.4 International and language setup

- Hreflang appears on 12 pages: the two homepages, 5 English guides ↔ 5 Danish game pages (en-og-et, dansk-praepositioner, ordstilling-detektiv, pronomenmysteriet, tidsmaskinen).
- **Checks passed:** every page has a self-referencing entry; pairs are reciprocal (each target links back); codes are valid (`da`, `en`, `x-default`); all targets exist and equal their canonicals; HTML placement only.
- **Observation:** `x-default` points to the Danish game in the guide↔game pairs (S08). `blog/*` has no Danish twin, so no hreflang is needed. The remaining games (adverbs, antonyms, flashcards, boejningsvaerkstedet, etc.) have no English twin, so no hreflang is correct.
- `lang` attributes match the content.

### 3.5 Structured data

- All JSON-LD blocks parse (0 parse errors across 29 files).
- Types in use: `WebSite` + `EducationalOrganization` + `BreadcrumbList` (home); `WebSite` + `BreadcrumbList` (`/en/`); `Blog`/`BlogPosting` + `BreadcrumbList` (blog); `Article` + `FAQPage` + `BreadcrumbList` (5 guides); `LearningResource` + `BreadcrumbList` (15 games).
- **Opportunities that fit:** add `image` to Article/BlogPosting/LearningResource once an image exists (S02); add `isPartOf`/`publisher` links from games to the `WebSite`; `inLanguage` is already set. A `SearchAction` on `WebSite` is only worth it if the homepage game search is a real URL-based search (it is client-side). Not written here.
- JSON-LD is static in the HTML, so it is visible without rendering. Confirm in the Rich Results Test (not verifiable here).

### 3.6 Internal linking

- **Most linked:** `index.html` (22 inbound), `blog/index.html` (12), `en/index.html` (6), `blog/danish-inversion` and `ikke-in-subordinate-clauses` (5 each).
- **Fewest (other than the orphan):** adverbs, boejningsvaerkstedet, danish-antonyms-game, flashcards, idiomjaeger, `en/danish-prepositions`, saetningsmaskinen: 2 each (home and `/en/` index only, or one article).
- **Blog/guides → games:** yes. Each guide/post links to its game with "Play X →" style anchors (e.g. `blog/danish-inversion` → ordstilling-detektiv, `blog/og-fordi-derfor` → forbindenor, konjunktioner).
- **Games → guides:** none (S04). Game pages have only `← MENU`.
- **Anchor quality:** guide→guide links use full titles (good). Generic anchors: "← MENU" (26 uses), "blog" (23), "← all posts". Homepage cards use descriptive `<h3>`.
- **Games with no guide:** adverbs, antonyms, flashcards, idiomjaeger, boejningsvaerkstedet, magiske_verber (linked only from the verb-tenses guide), dansk-mester (linked from prepositions guide). Content gap candidates for new guides.

### 3.7 Performance and technical hygiene (static)

- **Images:** the repo contains no `<img>` elements in deployed pages (sprites are drawn by `data-sd-sprite` via `shared/sjovt.js`), so there are no alt, width/height or format problems. Consequence: no image search presence and no OG image (S02).
- **Fonts:** 5 `.woff2` files, 84 KB total, `font-display: swap` set. No `<link rel="preload">` for fonts anywhere.
- **JS weight:** inline scripts of 49 KB (adverbs), 88 KB (antonyms), 67 KB (praepositioner), 72 KB (en-og-et), 96 KB (forbindenor), 85 KB (idiomjaeger), plus shared 41 KB + 36 KB. Homepage HTML is 30 KB. `defer` is only used on blog pages (S10). No third-party libraries or external hosts referenced from deployed pages.
- **Render-blocking:** `shared/sjovt.js` is loaded synchronously in `<head>` on the homepage (`index.html:19`) and in games; stylesheets per game: up to 5.
- **Viewport:** present on all pages. **Favicon:** none (S03). **404 page:** none (S12).
- **Broken links/assets:** 0 broken internal `href`s, 0 missing CSS/JS references among the files checked.
- **Server:** no compression/caching rules in `.htaccess` (S11). Actual response headers can't be checked from the repo.
- **Deploy allowlist:** `build-dist.sh` copies `./*.html` plus listed dirs. A new top-level folder must be added to `DIRS` or it will not be deployed; this is why `pixel-animation.html` slipped in (root-level `*.html` are copied automatically).

### 3.8 Social sharing

- **Open Graph:** `og:title`, `og:description`, `og:type`, `og:url`, `og:locale` are on all 28 real pages and consistent with title/description. Missing everywhere: `og:image` (+ width/height/alt), `og:site_name`.
- **Twitter/X:** no `twitter:*` tags at all (X falls back to OG, but with no image there is no card image).
- **og:image file check:** nothing to verify, no image is declared and the repo has no suitable asset. Screenshots exist only in `docs/redesign/screenshots/` (not deployed).
- `og:locale` is `da_DK` on Danish pages and `en_GB` on the English pages spot-checked (`en/index.html`, `blog/index.html`, `en/en-or-et`), consistent with `lang`.

---

## 4. Page inventory

Columns: title length | description length | h1 text (count) | lang | canonical | og:title/description/image | words of static visible text | hreflang. ⚠ = under ~150 words.

| Path | Title | Desc | H1 (count) | lang | Canonical | OG t/d/img | Words | hreflang |
|---|---|---|---|---|---|---|---|---|
| index.html | 56 | 154 | SjovtDansk ved at spille (1) | da | ✓ (/) | ✓/✓/✗ | 337 | ✓ |
| adverbs.html | 54 | 151 | Sætningsbyggeren (1) | da | ✓ self | ✓/✓/✗ | 97 ⚠ | – |
| danish-antonyms-game.html | 50 | 146 | Danske modsætninger – øv antonymer (1) | da | ✓ self | ✓/✓/✗ | 163 | – |
| dansk-praepositioner.html | 56 | 144 | Præpositionsmester (1) | da | ✓ self | ✓/✓/✗ | 36 ⚠ | ✓ |
| idiomjaeger.html | 59 | 150 | Idiomjæger (1) | da | ✓ self | ✓/✓/✗ | 16 ⚠ | – |
| magiske_verber.html | 56 | 145 | Magiske Verber (1) | da | ✓ self | ✓/✓/✗ | 93 ⚠ | – |
| boejningsvaerkstedet/index.html | 54 | 148 | Bøjningsværkstedet (1) | da | ✓ self | ✓/✓/✗ | 24 ⚠ | – |
| danish_flashcards/danish_flashcards_game/index.html | 54 | 147 | Verb-glosekort (1) | da | ✓ self | ✓/✓/✗ | 44 ⚠ | – |
| danske-phraser/dansk-mester.html | 57 | 147 | Dansk Mester (1) | da | ✓ self | ✓/✓/✗ | 2 ⚠ | – |
| en-og-et/index.html | 52 | 149 | Ordenes Vidunderland (1) | da | ✓ self | ✓/✓/✗ | 153 | ✓ |
| forbindenor/Forbindenor.html | 53 | 144 | FORBINDEORD (1) | da | ✓ self | ✓/✓/✗ | 37 ⚠ | – |
| konjunktioner/konjunktioner.html | 54 | 152 | Konjunktion Crush (1) | da | ✓ self | ✓/✓/✗ | 102 ⚠ | – |
| ordstilling-detektiv/index.html | 54 | 147 | Ordstillingsdetektiven (1) | da | ✓ self | ✓/✓/✗ | 77 ⚠ | ✓ |
| pronomenmysteriet/index.html | 55 | 149 | Pronomenmysteriet (1) | da | ✓ self | ✓/✓/✗ | 18 ⚠ | ✓ |
| saetningsmaskinen/index.html | 58 | 142 | Sætningsmaskinen (1) | da | ✓ self | ✓/✓/✗ | 19 ⚠ | – |
| tidsmaskinen/index.html | 58 | 145 | Tidsmaskinen (1) | da | ✓ self | ✓/✓/✗ | 13 ⚠ | ✓ |
| blog/index.html | 54 | 153 | Danish grammar, explained simply (1) | en | ✓ self | ✓/✓/✗ | 173 | – |
| blog/danish-inversion/index.html | 58 | 154 | Danish inversion: why the verb jumps in front of the subject (1) | en | ✓ self | ✓/✓/✗ | 754 | – |
| blog/og-fordi-derfor/index.html | 59 | 150 | og, fordi or derfor? Three ways to join Danish sentences (1) | en | ✓ self | ✓/✓/✗ | 812 | – |
| blog/ikke-in-subordinate-clauses/index.html | 54 | 155 | Where does ikke go? Danish word order in subordinate clauses (1) | en | ✓ self | ✓/✓/✗ | 726 | – |
| blog/sin-or-hans/index.html | 55 | 152 | sin or hans? Danish reflexive possessives made simple (1) | en | ✓ self | ✓/✓/✗ | 585 | – |
| blog/har-or-er-perfect/index.html | 59 | 155 | har or er? Choosing the helper verb in the Danish perfect (1) | en | ✓ self | ✓/✓/✗ | 594 | – |
| en/index.html | 50 | 149 | Learn Danish grammar with free games (1) | en | ✓ self | ✓/✓/✗ | 354 | ✓ |
| en/en-or-et/index.html | 56 | 149 | En or et? How to know the gender of Danish nouns (1) | en | ✓ self | ✓/✓/✗ | 706 | ✓ |
| en/danish-word-order/index.html | 56 | 151 | Danish word order: the V2 rule made simple (1) | en | ✓ self | ✓/✓/✗ | 771 | ✓ |
| en/danish-prepositions/index.html | 52 | 148 | Danish prepositions: i, på, til and af explained (1) | en | ✓ self | ✓/✓/✗ | 696 | ✓ |
| en/danish-verb-tenses/index.html | 58 | 143 | Danish verb tenses: present, past, perfect and future (1) | en | ✓ self | ✓/✓/✗ | 737 | ✓ |
| en/danish-pronouns/index.html | 54 | 152 | Danish pronouns: jeg or mig, min or sin (1) | en | ✓ self | ✓/✓/✗ | 806 | ✓ |
| pixel-animation.html | 15 | – | – (0) | da | ✗ | ✗/✗/✗ | 5 ⚠ | – |

All titles end in "| Sjovt Dansk". No `noscript`, no `img`, no `robots` meta, no `twitter:*`, no favicon link on any row. H1 texts are truncated where long; `&shy;` soft hyphens removed for display.

---

## 5. Quick wins (under 30 minutes each)

0. **Add Sætningsmaskinen to the homepage and `/en/`** (S20).
1. **Remove or noindex `pixel-animation.html`** (S05): one line in `build-dist.sh` or one meta tag.
2. **Add a favicon** (S03): one SVG/PNG in `shared/` and one `<link>` line per page (script it, 28 pages).
3. **Add `og:site_name` and `twitter:card`** to every head now, and `og:image` as soon as one image exists (S02).
4. **Add `ErrorDocument 404 /404.html`** and a minimal 404 page (S11/S12).
5. **Add `mod_deflate` and cache headers** to `.htaccess` (S11), if the host allows overrides.
6. **Regenerate sitemap `lastmod`** from git and drop `<priority>` (S07).
7. **Remove `&shy;` from h1 text** on 3 pages (S09).
8. **Change `← MENU`** to a descriptive label (S18).
9. **Add `defer`** to `shared/sjovt.js` where load order permits, after a quick test per page (S10).

---

## 6. Not verifiable from the repo

- **Live HTTP behaviour:** actual response headers (status codes, `X-Robots-Tag`, compression, cache, HSTS), whether the redirects in `.htaccess` really fire on the host, and whether `/favicon.ico` or `/404` really return 404.
- **Google Search Console:** Pages (indexing) report, i.e. which of the 28 URLs are "Crawled – currently not indexed" (likely candidates: the thin game pages); sitemap processing status; hreflang or structured-data enhancements; Core Web Vitals; Manual actions; the Performance report for real queries, impressions, CTR and which pages Google actually shows.
- **URL Inspection:** the rendered HTML Google sees for a game page and whether `/shared/*.js` loads without errors.
- **Rich Results Test / Schema validator:** confirms the JSON-LD (it parses here, but eligibility is Google's call).
- **PageSpeed Insights / Lighthouse:** real LCP, INP, CLS and transfer sizes for the heaviest pages (`forbindenor`, `danish-antonyms-game`, `idiomjaeger`).
- **Backlinks, domain authority, rankings, competitors:** Ahrefs/Semrush or GSC Links report.
- **Bing Webmaster Tools:** index coverage and sitemap submission.
- **Domain/DNS setup:** www and apex DNS, TLS certificate validity, any CDN in front.
- **Keyword demand:** whether the targeted Danish phrases (e.g. "præpositioner øvelser", "en eller et") have volume. Needs a keyword tool.

---

## 7. Suggested implementation order (small, safe PRs)

1. **PR 1: hygiene (no content risk).** Remove or noindex `pixel-animation.html` (S05), add 404 page and `ErrorDocument` (S12), `.htaccess` compression and caching (S11). Verify with `scripts/build-dist.sh` and one real deploy.
2. **PR 2: head metadata.** Favicon (S03), `og:site_name`, `twitter:card`, plus the `og:image` asset and tags (S02), all scripted across the 28 heads. Re-run the structured-data `image` additions here (S13, S14).
3. **PR 3: sitemap.** Generate `lastmod` from git, drop `priority` (S07). Optionally decide the `x-default` policy (S08).
4. **PR 4: h1/markup fixes.** Soft hyphens and h1 alignment (S09), a single `<main>` per game page (S17), anchor text for the menu link (S18). Check with the existing `tests/` UI checks (see the `game-ui-verification` skill) because these touch game shells.
5. **PR 5 onward: game-page content, one PR per 3–4 games.** Static explanatory block + `<noscript>` + links to the matching guide (S01, S04, S06). Start with the games that already have a guide twin and the lowest word counts: danske-phraser, tidsmaskinen, pronomenmysteriet, saetningsmaskinen, boejningsvaerkstedet, idiomjaeger. Use the `danish-seo-writing` skill for the copy.
6. **Later, behind data:** script deferral and CSS consolidation (S10) after a Lighthouse baseline; new guides for the games that have none; URL renames (S15) only with 301s.

After each PR: re-run the extraction, submit the sitemap again in Search Console, and watch the Pages report for two to three weeks before the next batch.

---

## 8. Implementation status (2026-10-15)

Done and tested (`tests/seo-static.mjs`, `tests/blog-static.mjs`, `scripts/build-dist.sh`, `tests/smoke.mjs` on the game pages):

- **S01, S04, S06:** every game page now has a static "Om <spil>" block (Danish intro, examples, link to the matching English guide/blog post, link home) and a `<noscript>` message, inserted before `</body>`. Links are 44 px tall to pass the tap-target check.
- **S02:** `shared/og-image.png` (1200×630) plus `og:image`, size, alt, `og:site_name` and `twitter:*` tags on all 28 pages.
- **S03:** `shared/favicon.svg` linked from all 28 pages. (No PNG `apple-touch-icon` yet.)
- **S05:** `pixel-animation.html` got `noindex` and is no longer copied by `scripts/build-dist.sh`.
- **S07:** sitemap `lastmod` set to 2026-10-15 (all pages were edited) and `<priority>` removed.
- **S11, S12:** `404.html` (noindex) + `ErrorDocument 404`, deflate and expires rules in `.htaccess`.
- **S20 was a false positive:** Sætningsmaskinen is intentionally not on the homepage yet (`PROGRESS.md`, task `saetning-game-2`: register once modes 5–7 and the dataset are done). Left as is; consider also removing it from the sitemap until it is released.

Not done (risk or needs a decision): S08 (x-default policy), S09 (h1 text and soft hyphens, touches theme layout), S10 (script `defer`, needs a Lighthouse baseline), S15 (URL renames), S17 (single `<main>`), S18 (menu link label), S13/S14 (JSON-LD `image`, now possible because the OG image exists).

Test notes: `smoke.mjs` reports the same failures with and without these changes on pages whose play button is not `#btn-play`, and a contrast failure on Sætningsmaskinen tile numbers; both are pre-existing.
