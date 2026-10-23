---
name: refusals-dirty-worktree
description: why releases keep getting refused
metadata:
  type: feedback
---
Refused 3 releases this week (quiz-scoring, quiz-timer, data-cleanup): gate 2 failed because the task worktree had uncommitted files under .claude/agent-memory/builder/. Builder writes them after its last commit.
Also could not find the checker report for quiz-timer at reports/quiz-timer.md; checker had written reports/timer.md.
**Why:** recurring. **How to apply:** check porcelain first and ask orchestrator to clean.
