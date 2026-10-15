---
name: file-origin-shared-localstorage
description: All file:// pages in one puppeteer browser share localStorage, so saved prefs/SRS leak between spec sections; isolate pages with browser contexts
metadata:
  type: feedback
---

In a multi-section spec using one `launch()`, the game's saved mode/group/level prefs and SRS state persist from earlier sections into later ones (file:// is one origin). Symptom: later "bulk" section saw only the last-selected group's items (144/432), and a typed-only data override hit an empty pool.

**Why:** a "flake" the coder and I both saw in combined runs only; passed when sections ran alone. Looked like a game bug, was the harness.
**How to apply:** wrap `browser.newPage` to use `browser.createBrowserContext().newPage()` (done in tests/tal-og-tid.mjs). Also: don't start a second background test job while one runs (they kill each other's Chrome, "Target closed"), poll a unique log/done-file, and keep each job under the 30 min background limit.
