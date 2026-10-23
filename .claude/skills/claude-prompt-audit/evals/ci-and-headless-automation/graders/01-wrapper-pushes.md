---
type: llm
focus: trace
weight: 1
---

The report flags that nightly.sh runs git add -A, commits and pushes after the agent finishes, contradicting the nightly prompt's branch/PR rule and/or CLAUDE.md's rule that nobody pushes to main.
