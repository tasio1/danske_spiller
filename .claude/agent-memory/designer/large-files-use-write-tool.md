---
name: large-files-use-write-tool
description: Big CSS heredocs through Bash failed with "unexpected EOF"; use the Write tool for theme files
metadata:
  type: feedback
---

Create theme CSS (100+ lines with quotes/unicode) with the Write tool, not `cat <<'EOF'` in Bash.

**Why:** a 130-line heredoc died with `unexpected EOF while looking for matching '` and nothing was written (later steps in the same command never ran).

**How to apply:** Write the file, then run link/sed/shot steps in separate Bash calls. Shot runs of 8 viewport/scheme combos exceed the 120 s timeout: run in background or split VPS. Worktree git status may show other agents' `.claude/agent-memory/*` changes; never stage them.
