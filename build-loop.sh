#!/usr/bin/env bash
# build-loop.sh — runs one bounded Claude Code increment locally, pushes to git,
# and sends a phone push notification (via ntfy.sh) when the run stops —
# whether it finished cleanly, errored, or found nothing to do.
#
# Requires: claude CLI installed + authenticated, git configured, curl, jq.
# Run manually to test: ./build-loop.sh
# Then schedule with cron (see bottom of this file for the crontab line).

set -euo pipefail

# ============================================================
# EDIT NTFY_TOPIC BEFORE FIRST USE
# ============================================================
REPO_DIR="/c/Users/taras/Downloads/danske_spiller"
NTFY_TOPIC="taras-dansk-build-9k4m"             # <-- subscribe to this in the ntfy app
#                                                       then subscribe to the same string
#                                                       in the ntfy app on your phone
# ============================================================

LOG_DIR="$REPO_DIR/.build-logs"
TIMESTAMP="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
LOG_FILE="$LOG_DIR/run-$TIMESTAMP.json"

mkdir -p "$LOG_DIR"
cd "$REPO_DIR"

# ---- helper: send ntfy push notification -------------------
notify() {
  # $1 = title  $2 = message  $3 = priority (low|default|high)  $4 = tags (optional)
  curl -s \
    -H "Title: $1" \
    -H "Priority: ${3:-default}" \
    -H "Tags: ${4:-robot}" \
    -d "$2" \
    "https://ntfy.sh/$NTFY_TOPIC" > /dev/null || true
}

# ---- bail out quietly if nothing is queued -----------------
if ! grep -q "status: todo" PROGRESS.md; then
  notify \
    "danske_spiller: nothing to do" \
    "No todo tasks in PROGRESS.md — skipped this run." \
    "low" "zzz"
  exit 0
fi

# ---- run one bounded increment -----------------------------
set +e
claude -p "$(cat .claude/prompts/build-increment.md)" \
  --output-format json \
  --max-turns 25 \
  --allowedTools "Read,Write,Edit,Glob,Grep,Bash(git *)" \
  --dangerously-skip-permissions \
  > "$LOG_FILE"
CLAUDE_EXIT=$?
set -e

# ---- commit + push whatever changed ------------------------
git add -A
if git diff --cached --quiet; then
  PUSHED="no changes committed"
else
  COMMIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  git commit -m "Auto-build: increment $TIMESTAMP" > /dev/null
  git push
  PUSHED="pushed ($(git rev-parse --short HEAD))"
fi

# ---- parse run summary from JSON log -----------------------
COST=$(jq -r '.total_cost_usd // "n/a"' "$LOG_FILE" 2>/dev/null || echo "n/a")
TURNS=$(jq -r '.num_turns // "n/a"' "$LOG_FILE" 2>/dev/null || echo "n/a")
IS_ERROR=$(jq -r '.is_error // false' "$LOG_FILE" 2>/dev/null || echo "unknown")

# ---- notify based on outcome -------------------------------
if [ "$CLAUDE_EXIT" -ne 0 ] || [ "$IS_ERROR" = "true" ]; then
  notify \
    "danske_spiller: FAILED" \
    "Run $TIMESTAMP exited with an error. Check $LOG_FILE. Turns: $TURNS, cost: \$$COST" \
    "high" "warning"
else
  notify \
    "danske_spiller: run complete ($PUSHED)" \
    "Run $TIMESTAMP finished normally. Turns: $TURNS, cost: \$$COST. $PUSHED" \
    "default" "white_check_mark"
fi

# ============================================================
# CRONTAB SETUP
# Run `crontab -e` and add the line below (edit the path first):
# 0 */4 * * * /bin/bash /c/Users/taras/Downloads/danske_spiller/build-loop.sh >> /c/Users/taras/Downloads/danske_spiller/.build-logs/cron.log 2>&1
# ============================================================
