Audit the demo module at $ARGUMENTS for outdated patterns, sync markdown guides, and suggest new demos.

## Goal

Run 4 parallel sub-agent tasks, synthesize into an audit report, then write `FINDINGS.md`.

### Task A: Audit Existing Demos

For each demo in `db.json → demos`:
- Confirm route exists in `demo.routes.ts`
- Confirm markdown file exists in `public/markdown/<url>.md`
- Scan component `.ts` for anti-patterns:

| Anti-pattern | Severity |
|---|---|
| `@Input()` / `@Output()` decorators | Critical |
| `*ngIf` / `*ngFor` / `*ngSwitch` | Critical |
| `async pipe + Observable` for HTTP | High |
| `toSignal(http.get(...))` | High |
| `BehaviorSubject` for local state | Medium |
| Constructor injection | Medium |
| `ChangeDetectionStrategy.Default` | Medium |
| `CommonModule` import | Low |
| `ngClass` / `ngStyle` | Low |

### Task B: Update Markdown Guides (parallel with A)

For each guide flagged as out-of-date:
- Sync markdown to reflect current `.ts` and `.html` implementation
- Add before/after code blocks where migration is the demo story
- Keep structure: bullet points + fenced code blocks, no prose

### Task C: Catalog db.json (parallel with A & B)

- Find component folders with no db.json entry
- Generate missing entries: `url`, `title`, `teaches`, `topic`, `sortOrder`, `md`
- Flag duplicates or incomplete metadata

### Task D: Suggest New Demos (parallel with A, B & C)

- Identify gaps in teaching progression
- Suggest 2-3 new demo ideas with url, title, description, and Angular docs references

### Cleanup (requires user approval)

- Delete orphan markdown files in `public/markdown/` not in db.json
- Flag routes in `demo.routes.ts` with no db.json entry

### Task E: Update Module README

Build/update table in module `readme.md` from db.json:

| # | Route | Title | Teaches | Topic |
|---|-------|-------|---------|-------|

## Output

Create `FINDINGS.md` in the module root with summary of all task results and action items.
