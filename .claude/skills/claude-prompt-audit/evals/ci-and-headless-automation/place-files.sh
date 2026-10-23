#!/usr/bin/env bash
# Copies the fixture and builds a small git history showing the nightly wrapper committing straight to main.
set -eu
cp -R "$(dirname "$0")/files/." .
git init -q -b main .
git config core.longpaths true; git config core.autocrlf false
git config user.email dev@example.com; git config user.name dev
git add -A; git commit -qm "feat: initial calculator"
echo 'export const sub = (a: number, b: number) => a - b;' >> src/math.ts
git add -A; git commit -qm "auto: nightly leftovers 2026-10-19"
echo '{"debug":true}' > nightly-output.json; echo 'TOKEN=abc' > .env.local
git add -A; git commit -qm "auto: nightly leftovers 2026-10-20"
echo 'export const mul = (a: number, b: number) => a * b;' >> src/math.ts
git add -A; git commit -qm "auto: nightly leftovers 2026-10-21"
