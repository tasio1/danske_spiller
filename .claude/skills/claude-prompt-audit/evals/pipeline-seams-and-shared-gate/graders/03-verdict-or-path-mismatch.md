---
type: llm
focus: trace
weight: 1
---

The report flags at least one checker→shipper hand-off mismatch: checker can emit FLAKY which shipper's gate doesn't handle, or checker writes reports/<feature-name>.md while shipper reads reports/<task-id>.md.
