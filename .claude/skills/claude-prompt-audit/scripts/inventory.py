#!/usr/bin/env python3
"""List every place in a repo that holds or launches a Claude prompt.

Usage: python inventory.py [repo_root]
Prints one section per surface with paths, line counts and the key settings
(model, tools, skills, claude_args, flags) so the auditor knows what to read.
"""
import json
import os
import re
import sys

SKIP_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build",
             ".worktrees", "worktrees", ".next", ".cache"}
CODE_EXT = {".sh", ".bash", ".ps1", ".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".yml", ".yaml"}


def walk(root):
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip build/vendor dirs and skill eval fixtures (evals/<case>/files/), which hold fake prompts.
        in_evals = os.path.basename(os.path.dirname(dirpath)) == "evals"
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not (in_evals and d == "files")]
        for f in filenames:
            yield os.path.join(dirpath, f)


def rel(root, p):
    return os.path.relpath(p, root).replace("\\", "/")


def read(p):
    try:
        with open(p, encoding="utf-8", errors="replace") as fh:
            return fh.read()
    except OSError:
        return ""


def frontmatter(text):
    m = re.match(r"^---\s*\n(.*?)\n---", text, re.S)
    if not m:
        return {}
    out, key = {}, None
    for line in m.group(1).splitlines():
        kv = re.match(r"^([A-Za-z_-]+):\s*(.*)$", line)
        if kv:
            key = kv.group(1)
            out[key] = kv.group(2).strip()
        elif key and line.strip().startswith("-"):
            out[key] = (out[key] + " " + line.strip()).strip()
    return out


def main():
    root = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
    files = list(walk(root))
    sections = {k: [] for k in ["agents", "skills", "commands", "memory-files", "settings-hooks",
                                "workflows", "headless-cli", "sdk", "agent-memory"]}

    for p in files:
        r = rel(root, p)
        name = os.path.basename(p)
        text = None
        if re.search(r"(^|/)\.claude/agents/[^/]+\.md$", r):
            text = read(p)
            fm = frontmatter(text)
            sections["agents"].append(f"{r} ({text.count(chr(10))} lines) model={fm.get('model', '-')} "
                                      f"tools={fm.get('tools', '(all)')} skills={fm.get('skills', '-')}")
        elif re.search(r"(^|/)\.claude/skills/[^/]+/SKILL\.md$", r):
            text = read(p)
            sections["skills"].append(f"{r} ({text.count(chr(10))} lines)")
        elif re.search(r"(^|/)\.claude/commands/.+\.md$", r):
            sections["commands"].append(r)
        elif name in ("CLAUDE.md", "AGENTS.md", "CLAUDE.local.md"):
            sections["memory-files"].append(f"{r} ({read(p).count(chr(10))} lines)")
        elif re.search(r"(^|/)\.claude/settings(\.local)?\.json$", r):
            try:
                hooks = json.loads(read(p)).get("hooks", {})
            except ValueError:
                hooks = {"<unparseable>": []}
            if hooks:
                sections["settings-hooks"].append(f"{r}: hooks={','.join(hooks)}")
        elif "/agent-memory/" in "/" + r or re.search(r"(^|/)memory/MEMORY\.md$", r):
            sections["agent-memory"].append(r)

        ext = os.path.splitext(name)[1].lower()
        if ext not in CODE_EXT:
            continue
        text = text if text is not None else read(p)
        if r.startswith(".github/workflows/") and "claude-code-action" in text:
            on_block = re.search(r"^on:[ \t]*\n((?:[ \t]+.*\n|[ \t]*\n)*)", text, re.M)
            trig = re.findall(r"^ {2}([a-z_]+):", on_block.group(1), re.M) if on_block else []
            perms = sorted(set(re.findall(r"^\s+([a-z-]+):\s*write", text, re.M)))
            tools = re.findall(r"--allowed-?tools\s+\"([^\"]+)\"", text, re.I)
            has_prompt = bool(re.search(r"^\s+prompt:", text, re.M))
            sections["workflows"].append(
                f"{r}: triggers={trig} write_perms={perms} prompt={'yes' if has_prompt else 'NO'} "
                f"allowed_tools={tools or '(default)'}")
        lines = text.splitlines()
        for i, ln in enumerate(lines):
            if not re.search(r"\bclaude\s+(-p|--print)\b", ln):
                continue
            parts, j = [ln], i
            while parts[-1].rstrip().endswith("\\") and j + 1 < len(lines):
                j += 1
                parts.append(lines[j])
            line = i + 1
            snippet = " ".join(" ".join(x.rstrip().rstrip("\\") for x in parts).split())[:300]
            flags = [f for f in ("--dangerously-skip-permissions", "bypassPermissions", "--allowedTools",
                                 "--allowed-tools", "--max-turns") if f in snippet]
            sections["headless-cli"].append(f"{r}:{line}: {snippet}  flags={flags}")
        if os.path.abspath(p) != os.path.abspath(__file__) and re.search(r"(from anthropic import|import anthropic|@anthropic-ai/sdk|claude_agent_sdk|"
                     r"@anthropic-ai/claude-agent-sdk)", text):
            sections["sdk"].append(r)

    for k, v in sections.items():
        print(f"## {k} ({len(v)})")
        for item in sorted(v):
            print(f"- {item}")
        print()
    print("Next: read every prompt above in full, plus any prompt file a headless/SDK entry loads.")


if __name__ == "__main__":
    main()
