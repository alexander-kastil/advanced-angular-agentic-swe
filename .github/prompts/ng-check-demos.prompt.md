---
name: check-ng-demos
description: Audit demo guides and components in any demos/ module, update outdated patterns to Angular v20+ best practices, and suggest new demos.
agent: Angular Expert
model: Claude Haiku 4.5 (copilot)
---

## Goal

Audit a demo module for outdated patterns, update markdown guides, suggest improvements, and clean artifacts using parallelized sub-agent orchestration.

## Orchestration Flow

**Main Agent Responsibilities:**

1. Identify/confirm the target module
2. Launch 4 parallel sub-agents (see below)
3. Synthesize results into actionable audit report
4. Present findings to user

**Parallel Sub-Agent Tasks** (stateless, independent execution):

### Task A: Audit Existing Demos (Audit Agent)

**Input:** Module path + `db.json` + `demo.routes.ts`
**Output:** Validation report + outdated patterns flagged

**For each demo in `db.json → demos`:**

- Confirm route exists in `demo.routes.ts`
- Confirm markdown file exists in `public/markdown/<url>.md`
- Scan component `.ts` for anti-patterns (see table below)
- Scan component `.html` for structural directives needing migration
- Compare markdown content against actual implementation
- Return: List of [demoUrl, isValid, issues[], hasMarkdownMismatch]

**Anti-pattern Registry:**

| Anti-pattern                                 | Modern replacement                | Impact   |
| -------------------------------------------- | --------------------------------- | -------- |
| `@Input()` / `@Output()` decorators          | `input()` / `output()` signals    | Critical |
| `*ngIf` / `*ngFor` / `*ngSwitch`             | `@if` / `@for` / `@switch`        | Critical |
| `async` pipe + `Observable` for HTTP         | `httpResource()`                  | High     |
| `toSignal(http.get(...))`                    | `httpResource()`                  | High     |
| `effect()` + `.subscribe()` for data loading | `httpResource()` with reactive fn | High     |
| `BehaviorSubject` for local state            | `signal()`                        | Medium   |
| Constructor injection                        | `inject()` function               | Medium   |
| `CommonModule` import                        | Remove — standalone default       | Low      |
| `ngClass` / `ngStyle`                        | `[class]` / `[style]`             | Low      |
| `ChangeDetectionStrategy.Default`            | `ChangeDetectionStrategy.OnPush`  | Medium   |

### Task B: Update Markdown Guides (Markdown Agent)

**Input:** List of outdated demos + component source files
**Output:** Updated markdown files + diff summary

**For each guide flagged as out-of-date by Task A:**

- Sync markdown to reflect current `.ts` and `.html` implementation
- Add before/after code blocks if migration is central to the demo story
- Keep structure: bullet points + fenced code blocks (no prose fluff)
- Generate updated file content (do not commit yet)
- Return: [filename, status: "updated"|"no-change", diffSummary]

### Task C: Categorize & Update db.json (Catalog Agent)

**Input:** All component directories in module
**Output:** Complete demo catalog entries for db.json

**Scan all component folders:**

- Identify components WITHOUT db.json entries
- For each unregistered component, generate:
  - `url`: kebab-case slug (e.g., `standalone`, `form-validation`)
  - `title`: short focus description
  - `teaches`: 1-2 sentence concept summary
  - `topic`: category (e.g., "Component Fundamentals", "State Management", "Advanced Patterns")
  - `sortOrder`: logical progression number
  - `md`: the markdown filename without extension

**Validate existing entries:**

- Check all db.json demos have corresponding components
- Flag duplicates or incomplete metadata
- Return: [newEntries[], updatedEntries[], issues[]]

**Example entry:**

```json
{
  "url": "standalone",
  "title": "Standalone Component",
  "teaches": "Create standalone components without NgModule. Declare dependencies directly in the component decorator with imports, providers, and styles.",
  "sortOrder": 1,
  "topic": "Component Fundamentals"
}
```

### Task D: Suggest New Demos (Suggestion Agent)

**Input:** Existing demos in db.json + module topic
**Output:** Ranked list of 2-3 suggested demo ideas

**Analysis approach:**

- Identify gaps in teaching progression (topic/concept coverage)
- Cross-reference with Angular v20+ best practices
- For each suggestion:
  - Generate `url` and `title`
  - Write 1-2 sentence concept description
  - List 1-2 Microsoft Learn references to validate pattern
  - Flag if concept requires pre-requisite demo
- Return: [suggestion[], references[]]

---

## Bonus Task: Cleanup (conditional, after audit results)

**Only if user approves:**

- **Orphan markdown files:** Files in `public/markdown/` not referenced by db.json → delete
- **Route debris:** Routes in `demo.routes.ts` with no db.json entry → flag for review
- **Incomplete catalog entries:** db.json entries with missing metadata → flag for completion
- Return: [deletedFiles[], flaggedRoutes[], incompleteEntries[]]

---

## Task E: Update Module README Table (Final Step)

**Input:** db.json with all demos + their metadata
**Output:** Updated `readme.md` in module root with comprehensive demo table

**Actions:**

1. Locate or create table in the module's root `readme.md` (e.g., `demos/01-components/ng-components/readme.md`)
2. Build table from db.json with columns:
   - `#` - Sort order
   - `Route` - URL path (from `url` field)
   - `Title` - Demo title (from `title` field)
   - `Teaches` - Teaching objective (from `teaches` field)
   - `Topic` - Category/topic (from `topic` field) **← NEW COLUMN**
3. Sort table by `sortOrder` field
4. Format cleanly with markdown table syntax
5. Include only demos from db.json (verified entries)
6. Update file immediately after fixes are applied

**Example output:**

```markdown
| # | Route | Title | Teaches | Topic |
|---|-------|-------|---------|-------|
| 1 | standalone | Standalone Component | Create standalone components... | Component Fundamentals |
| 2 | control-flow | Control Flow | Use modern Angular control flow... | Component Fundamentals |
| ... | ... | ... | ... | ... |
```

**Return:** [fileName, status: "created"|"updated", rowCount, preview]

---

## Execution Summary

```
User Request
    ↓
Main Agent: Confirm module
    ↓
    ├─→ [Parallel] Task A: Audit existing demos
    ├─→ [Parallel] Task B: Update markdown guides
    ├─→ [Parallel] Task C: Categorize & update db.json
    └─→ [Parallel] Task D: Suggest new demos
    ↓
Main Agent: Synthesize results → present audit report
    ↓
[Optional] User approval → Execute cleanup
    ↓
Deliver consolidated report + file updates
```

---

## Final Deliverable

Create `FINDINGS.md` in the module root (e.g., `demos/02-reactive/ng-reactive/FINDINGS.md`) containing:

- **Summary:** Module name, audit date, audit status (pass/needs-work)
- **Task A Results:** Audit findings grouped by component with anti-pattern counts by severity
- **Task B Results:** Markdown sync status for each demo
- **Task C Results:** db.json validation report, new/updated entries, missing entries
- **Task D Results:** Proposed new demo suggestions with rationale
- **Cleanup Results:** Deleted files, flagged routes, incomplete entries (if executed)
- **Action Items:** Summary of changes made and next steps

**Note:** FINDINGS.md is a working document for audit transparency — not user-facing documentation.
