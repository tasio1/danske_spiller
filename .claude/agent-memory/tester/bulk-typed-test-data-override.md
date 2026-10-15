---
name: bulk-typed-test-data-override
description: How to drive every typed-answer variant through a real game UI quickly (data getter override + srs.record hook) and the SRS starvation trap
metadata:
  type: feedback
---

To test 1000+ free-text variants through the real UI: `page.evaluateOnNewDocument` defining a getter/setter on `window.<GAME>_DATA` that returns a transformed clone (one clone per variant, variant index in `prompt_da` as `@@n`), scale `setTimeout` by ~0.02, and wrap `DanskCore.srs.record` to log `[id, correct]`. Read correctness from that log, NOT from the input's `ok` class: with scaled timers the auto-advance replaces the input before you can read it (cost me a run of false mismatches).

**Why:** The game's checker lives in a closure; this tests the real code path. First attempt only reached 59/1567 variants because wrong answers get box 1 and the game's queue puts "just missed" items first, so a round is all misses forever.

**How to apply:** inside the record wrapper, after calling the original, set `st.items[id].box = 5; dueAt = Date.now()+1e12` so every clone is retired once answered. Also: oracle (DOM -> data item) must be read BEFORE answering (cloze blank is filled afterwards), and a `waitFor(page, fn, arg)` must pass `arg` to `page.evaluate` or it returns instantly. Reference implementation: tests/tal-og-tid.mjs + tests/lib/taltid-driver.mjs.
