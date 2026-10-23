---
name: claude-prompt-audit
description: Audit the prompts that drive Claude in a repository — subagent definitions (.claude/agents/*.md), skills, CLAUDE.md, slash commands, claude-code-action GitHub workflows, headless `claude -p` scripts and SDK system prompts — and produce a severity-ranked report with file:line evidence. Checks each prompt alone, the hand-offs between prompts, whether tool permissions match what the prompt says, whether referenced files/commands/skills actually exist and do what is claimed, and what git history or agent memory shows about real behaviour. Use whenever the user asks to audit, review, lint, sanity-check or harden their agents, agent prompts, subagents, Claude workflows, CLAUDE.md or automation prompts, or asks "are my agents set up right", "why does my agent pipeline keep doing X", or runs /claude-api-prompt-audit — even if they don't say "audit".
---

# Claude prompt audit

Agent prompts usually look fine one at a time. What breaks real pipelines is in the **seams**: one prompt hands work to another in a format the receiver doesn't expect; a prompt forbids something its tool allow-list permits (or demands something the allow-list blocks); several prompts trust a shared script to check something it doesn't check; an automation script quietly bypasses the gates the agents were told to respect. This skill finds those, with evidence, so the user can fix the few things that matter.

Default output is a report. Don't edit the prompts unless the user asks — they need to see and choose the fixes.

## 1. Inventory every prompt surface

Run the bundled inventory script from the repo root first; it finds the usual places in one pass:

```bash
python <skill-dir>/scripts/inventory.py .
```

It lists: `.claude/agents/*.md`, `.claude/skills/*/SKILL.md`, `.claude/commands/*.md`, `CLAUDE.md`/`AGENTS.md` at any depth, `.claude/settings*.json` hooks, GitHub workflows using `claude-code-action` (with their `prompt`, `claude_args`, `permissions`, triggers), shell/Python/JS files invoking `claude -p` / `claude --print` (with flags), prompt files those scripts read, and code using the Anthropic SDK (`system=` prompts). Read the script's output, then read **every listed prompt in full** — skimming is how seams get missed. Also note agent memory directories (`.claude/agent-memory/`, `memory/`) and logs; they are evidence, not prompts.

If the script misses something you can see (a prompt in an unusual place), include it anyway.

## 2. Per-prompt pass

For each prompt, look for:
- **Contradictions inside the prompt** (e.g. "read the three files" then lists four; a verdict enum that omits a value used later in the same file).
- **Missing stop / escalation conditions** for anything unattended or looping, and missing "if you couldn't check it, say NOT VERIFIED" honesty rules for any prompt that reports results.
- **Unbounded or vague scope** where the prompt can write files or run commands (no list of what it may touch).
- **Frontmatter problems**: invalid or missing `name`/`description`, `model` pins that are inconsistent across similar agents or ill-suited to the role (judgment-heavy orchestration vs mechanical work), `skills:` the body relies on but doesn't preload.
- **Dead weight**: copy-pasted boilerplate that doesn't apply to this agent, procedures that evidence shows never run. These cost context on every call.

Keep this pass short in the report; the next three passes usually find the important problems.

## 3. Seam pass — hand-offs between prompts

Build a quick map: who dispatches whom, what each produces (files, report formats, verdict words, commit messages, branch names, paths) and what each consumer expects. Then compare producer vs consumer literally:
- Enum/keyword mismatches (tester emits `FLAKY`, releaser's gate only knows `PASS|FAIL`).
- Path mismatches (`reports/<task-or-game-id>.md` vs `reports/<task_id>.md`).
- Format rules one side enforces and the other doesn't produce (commit message regex, required trailers).
- Ownership conflicts: two prompts both "own" a file, or a rule like "only the releaser pushes" that another prompt, workflow or script breaks.
- Agents an orchestrator doesn't know about (defined but never dispatched or gated).
- Instructions that collide in practice: "write memory at end of task" + "leave worktree clean".

**Shared checks deserve special suspicion.** When several prompts rely on the same script/command as a gate ("run validate.js", "npm test passes"), open that script and, if safe and cheap, run it. Confirm it covers what the prompts assume. A gate five prompts trust that doesn't check what they think is usually the single highest-value finding.

## 4. Permission pass — tools vs intent

For every prompt, put what it's **told** next to what it's **allowed**:
- Allowed but forbidden: `Bash(git *)` while the prompt says "never force-push" or "never push master" — the prompt is the only guard. Note it, scaled by blast radius (unattended + write token + broad tool = high).
- Required but not allowed: the prompt says "run the validator" / "check zero console errors" but `node` or a browser isn't in the allow-list — the run will skip it or fake it.
- Bypass flags: `--dangerously-skip-permissions`, `--permission-mode bypassPermissions` with an allow-list (contradictory intent), `contents: write` on a review-only job, workflows triggerable by untrusted actors.
- Workflows with **no prompt at all** (e.g. `@claude` handlers) run with none of the repo's rules.
- Scripts around the agent: a wrapper that does `git add -A && git commit && git push` after the agent finishes overrides everything the prompt said about branches and gates.

## 5. Reference pass

Check that every path, command, script, skill name and section reference ("§6 of skill X") a prompt relies on exists and is reachable by that agent (a skill referenced but not preloaded/available to a subagent is unreachable). Batch this with one shell loop rather than one call per path.

## 6. Evidence pass — how the prompts actually behave

Prompts state intent; history shows behaviour. Cheap, high-signal checks:
- `git log --oneline -20 --format="%h %an %s"` and `git branch -r --contains HEAD` — automated commits landing where they shouldn't (e.g. a build loop committing onto a feature branch and pushing it).
- Agent memory files — agents often record exactly where their instructions collided ("worktree dirty with memory files, failing gate 3"). Quote them.
- Logs or reports in the repo showing a gate passing on bad output.

Cite evidence as commit shas, file:line, or quoted memory lines. A finding with evidence of real damage outranks a theoretical one.

## 7. Write the report

Save to `docs/prompt-audit-<YYYY-MM-DD>.md` (or where the user asks), and give a short summary in chat: the top 2–3 findings and the path.

Severity:
- **High** — can ship wrong output, push/merge unreviewed work, leak secrets, or silently disable a gate; or evidence shows it already happened.
- **Medium** — seams and permission gaps that will cause failures or rely only on the model's obedience, without evidence of damage yet.
- **Low** — clarity, consistency, dead weight, model-choice suggestions.

Be proportionate. A small, sound setup gets a short report with few or no Highs; don't inflate style nits to fill sections. If something is uncertain (e.g. CLI flag precedence you can't confirm), say so in the finding rather than asserting it.

Template:

```markdown
# Prompt audit — <repo>
Date · branch · scope table (surface → files)
Method: one line.
Overall: 2–3 sentences — what's strong, where the real risk is.

## High
### H1. <claim in one line>
- What: <the problem, with file:line>
- Conflicts with: <the other prompt/permission/script, file:line>
- Evidence: <sha / memory quote / command output>
- Fix: <concrete change; smallest version first>

## Medium
## Low   (one bullet each is fine)
## What's working (keep)
## Suggested order
```

Each finding names both sides of a seam, so the user can see the conflict without re-reading everything.
