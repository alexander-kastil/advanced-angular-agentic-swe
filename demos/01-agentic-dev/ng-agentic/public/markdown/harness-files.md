# Harness Files

A harness file is the context an agent reads before every turn. It is the cheapest place to put a
standard and the most expensive place to put detail.

## The three files

| File | Read by | Scope |
| --- | --- | --- |
| `CLAUDE.md` | Claude Code | Repo root, plus any nested folder that carries its own. Nested files stack. |
| `AGENTS.md` | Codex, Cursor, JetBrains IDEs, Gemini CLI | The vendor neutral equivalent. Keep it a pointer to `CLAUDE.md`. |
| `.github/copilot-instructions.md` | GitHub Copilot | Repository wide. Pair with `*.instructions.md` scoped by an `applyTo` glob. |

angular.dev lists one more per environment: `GEMINI.md` for Antigravity, `cursor.md` for Cursor,
`.instructions.md` for VS Code and `guidelines.md` for Windsurf. Writing the same rules six times is
how they drift, so put the content in one file and make the rest a pointer.

## Where the content comes from

Do not invent the rules. `get_best_practices` on the Angular CLI MCP server returns the guide for the
installed version, and in 22.1 it says, verbatim:

- Must NOT set `standalone: true`. It is the default in v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush`. `OnPush` is the default in v22+.
- Use `input()` and `output()` instead of decorators, and `model()` for two-way binding.
- Use native control flow (`@if`, `@for`, `@switch`).
- Do NOT use `@HostBinding` / `@HostListener`, use the `host` object.
- Do NOT use `ngClass` / `ngStyle`, use class and style bindings.
- Prefer Signal Forms (`@angular/forms/signals`), stable in v22.
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singletons.
- Use `inject()` instead of constructor injection.

Copy those into the harness file, then add the rules only this repository knows: never commit, run
apps from their project folder, which module owns what.

## What belongs in one

Standards that apply to every turn and prohibitions you would be upset to find violated in a diff.
Write them as rules, not as prose.

## What does not

Anything long. The file loads on every turn, so a 400 line harness file is a per-turn tax on every
task including the ones it has nothing to do with. Push the depth into a skill and leave a one line
pointer behind.

## Precedence

Closest file wins. A rule in `demos/03-components/CLAUDE.md` overrides the repo root for work inside
that folder, and the root still applies to everything it does not mention.

## Claude Code specific

`CLAUDE.md` can import other files with `@path/to/file.md`, so a root file can pull in `AGENTS.md`
instead of duplicating it. `~/.claude/CLAUDE.md` holds personal rules for every project, and
`/memory` opens whichever file is loaded.

## Copilot specific

`.instructions.md` files live in `.github/instructions/` and take an `applyTo` glob in their
frontmatter, so TypeScript rules can be scoped to `**/*.ts` and template rules to `**/*.html`:

```markdown
---
applyTo: "**/*.html"
---
Use @if, @for and @switch. Never ngClass or ngStyle.
```

Reusable prompts live in `.github/prompts/*.prompt.md` and are invoked as `/name` in chat. Copilot
also reads `AGENTS.md`, which makes it the natural single source when a team runs both tools.

## One source for both tools

| Content | Claude Code | GitHub Copilot |
| --- | --- | --- |
| Repository rules | `CLAUDE.md`, importing `@AGENTS.md` | `AGENTS.md` or `.github/copilot-instructions.md` |
| Rules for one file type | nested `CLAUDE.md` per folder | `*.instructions.md` with `applyTo` |
| Reusable prompt | `.claude/commands/*.md` | `.github/prompts/*.prompt.md` |
