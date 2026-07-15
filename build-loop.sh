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
# Config. NTFY_TOPIC lives in .build-env (gitignored) because the topic name
# is a shared secret — anyone who knows it can read your notifications and
# send you push messages. Never put it in a tracked file.
# ============================================================
REPO_DIR="/c/Users/taras/Downloads/danske_spiller"

if [ -f "$REPO_DIR/.build-env" ]; then
  # shellcheck disable=SC1091
  . "$REPO_DIR/.build-env"
fi

if [ -z "${NTFY_TOPIC:-}" ]; then
  echo "ERROR: NTFY_TOPIC unset. Create $REPO_DIR/.build-env with:" >&2
  echo '  NTFY_TOPIC="your-topic-here"' >&2
  exit 1
fi
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
# Match only indented task fields ("  status: todo"), not the prose in the
# rules header, which also contains the words "status: todo" and would
# otherwise make this check always true.
if ! grep -qE '^[[:space:]]+status: todo' PROGRESS.md; then
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
# The agent commits its own work, so usually nothing is left staged here.
# This only sweeps up anything it left behind.
git add -A
if ! git diff --cached --quiet; then
  git commit -m "Auto-build: uncommitted leftovers $TIMESTAMP" > /dev/null
fi

# Push whatever is ahead of the remote, regardless of who committed it.
AHEAD=$(git rev-list --count '@{u}..HEAD' 2>/dev/null || echo 0)
if [ "$AHEAD" -gt 0 ]; then
  if git push > /dev/null 2>&1; then
    PUSHED="pushed $AHEAD commit(s), now at $(git rev-parse --short HEAD)"
  else
    PUSHED="PUSH FAILED — $AHEAD commit(s) still local"
  fi
else
  PUSHED="nothing to push"
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
# SCHEDULING (Windows — there is no cron here)
#
# Registered as scheduled task "danske-spiller-build", every 4 hours.
# To re-register from PowerShell:
#
#   $action = New-ScheduledTaskAction -Execute 'C:\Program Files\Git\bin\bash.exe' `
#     -Argument '-lc "/c/Users/taras/Downloads/danske_spiller/build-loop.sh >> /c/Users/taras/Downloads/danske_spiller/.build-logs/cron.log 2>&1"'
#   $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date.AddHours(2) `
#     -RepetitionInterval (New-TimeSpan -Hours 4)
#   $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopIfGoingOnBatteries `
#     -AllowStartIfOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 1)
#   Register-ScheduledTask -TaskName 'danske-spiller-build' -Action $action `
#     -Trigger $trigger -Settings $settings -Force
#
# Inspect / run now / remove:
#   Get-ScheduledTaskInfo -TaskName 'danske-spiller-build'
#   Start-ScheduledTask   -TaskName 'danske-spiller-build'
#   Unregister-ScheduledTask -TaskName 'danske-spiller-build' -Confirm:$false
#
# Note: runs only while this user is logged in.
# ============================================================
