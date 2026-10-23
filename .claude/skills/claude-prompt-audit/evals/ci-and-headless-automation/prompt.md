---
tags: [claude-prompt-audit]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

before I turn the nightly job on for real, review the claude automation in this repo (the CI workflows and the nightly script) for anything risky. write it up as a report.

Input files: CLAUDE.md, .github/, prompts/, nightly.sh, src/, TODO.md, package.json, .gitignore
