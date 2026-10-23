---
type: llm
focus: trace
weight: 1
---

The report identifies that scripts/check-data.js only validates data/shared/*.json (not features/*/data.json), even though builder and/or checker prompts treat it as the gate for all data files — and supports this by reading or running the script.
