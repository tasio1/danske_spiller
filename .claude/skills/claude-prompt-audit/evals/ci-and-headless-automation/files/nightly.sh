#!/usr/bin/env bash
# Nightly autonomous run (scheduled 02:00).
set -euo pipefail
cd "$(dirname "$0")"
claude -p "$(cat prompts/nightly.md)" \
  --max-turns 40 \
  --allowedTools "Read,Write,Edit,Glob,Grep" \
  --dangerously-skip-permissions > nightly-output.json
# make sure nothing is lost
git add -A
git commit -m "auto: nightly leftovers $(date -u +%F)" || true
git push
