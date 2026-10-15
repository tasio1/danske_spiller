---
name: independent-generator-for-generated-data
description: For generated Danish number/clock/date datasets, write a separate generator+parser and compare all items instead of sampling
metadata:
  type: feedback
---

Tal og tid data is produced by scripts/gen-*.js; sampling it by eye is weak and re-running the same generator proves nothing. Writing a ~40-line independent Danish cardinal/ordinal/year generator and a clock-phrase parser (phrase -> minutes mod 720) and comparing every item (plus "no distractor equals the correct meaning") covers 100% and took minutes. Also add a negative control (mutate expected value, confirm the checker fires) before trusting a green result, e.g. for SVG clock hand angles.

**Why:** Human-read sampling can't tell `fireoghalvtreds` from `fireoghalvfjerds`; arithmetic can.
**How to apply:** do this for any programmatic dataset (numbers, clocks, dates, prices); reserve native-check flags for convention questions (e.g. `tyve over` vs `ti i halv`, regent-name capitals).
