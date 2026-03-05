---
name: update-ng
description: This prompt is used to guide the process of updating an Angular application to the latest version. It includes instructions for using the Angular CLI for updates, managing packages with npm, enabling zoneless change detection, and ensuring compatibility with Angular v21+. Use this prompt when you need to perform an Angular update or when you have questions about the update process.
model: Claude Haiku 4.5 (copilot)
tools: [execute, read, agent, edit, search, web, 'angular-cli/*', 'chrome-devtools/*', todo]
argument-hint: Provide a path to the Angular project to update along with optional instructions
---

## Goal

Upgrade an Angular application to the latest version with comprehensive testing, compatibility auditing, and optimization recommendations using sub-agent orchestration.

## Prerequisites

**Main Agent Responsibilities:**
1. Identify project path (from context or user input)
2. Detect dependencies: Angular Material, Angular CDK, NgRx, json-server needs
3. Launch parallel and sequential sub-agents
4. Synthesize audit reports + recommendations
5. Prompt user for approval before breaking-change refactoring or zoneless migration
6. Cleanup servers on exit

---

## Orchestration Flow

```
Main Agent: Identify project + detect dependencies
    ↓
    ├─→ [Parallel] Task A: Core dependencies upgrade
    └─→ [Parallel] Task B: Dev environment setup (json-server + ng serve)
              ↓
    ├─→ [Sequential after B] Task C: Runtime error audit
    ├─→ [Sequential after B] Task D: Dev console audit  
    └─→ [Sequential after B] Task E: Route-specific testing
              ↓
    ├─→ [Parallel after audit] Task F: Zoneless migration analysis
    └─→ [Parallel after audit] Task G: Optimization suggestions
              ↓
Main Agent: Synthesize findings → Present report
    ↓
User approval → Execute approved refactoring
    ↓
Main Agent: Update package.json version → Cleanup
```

---

## Sub-Agent Task Definitions

### Task A: Core Dependencies Upgrade
**Trigger:** After project path confirmed  
**Runs in Parallel with:** Task B  
**Input:** Project path, detected dependencies (Angular Material? CDK? NgRx? Other 3rd-party?)  
**Output:** Upgrade success status, breaking changes log, new versions applied

**Process:**
1. **Analyze current `package.json`:**
   - Read Angular version, Material version (if present), CDK version (if present), NgRx packages (if present)
   - Detect peer dependencies that must align

2. **Build upgrade commands** in priority order:
   ```
   ng update @angular/core @angular/cli
   ng update @angular/material [--allow-dirty] [if present]
   ng update @angular/cdk [if Material or standalone CDK usage]
   ng update @ngrx/store @ngrx/effects @ngrx/data [if NgRx used]
   ng update @angular/forms @angular/router @angular/common
   ```

3. **Review changelogs:**
   - Check https://github.com/angular/angular/releases for major version breaking changes
   - Note: Signal API changes, OnPush defaults, hydration requirements, etc.
   - Flag any structural breaking changes

4. **Return:** 
   - [upgradeSuccess: boolean, newAngularVersion: string, breakingChanges: [], commandsRun: []]

**Notes:**
- Use `--allow-dirty` only if workspace has uncommitted changes
- Do NOT run `ng update` for non-Angular packages (handle separately if needed)

---

### Task B: Dev Environment Setup
**Trigger:** After project path confirmed  
**Runs in Parallel with:** Task A  
**Input:** Project path, target version from Task A (optional — use whatever A reports)  
**Output:** Server URLs, PID/handle for cleanup, health check status

**Process:**
1. **Check for `db.json` in project root:**
   - If found, launch `json-server --watch db.json` in separate VS Code terminal
   - Confirm server is listening on default port (3000)
   - Record terminal handle for cleanup

2. **Run `ng serve` in main terminal:**
   - Wait for "Application bundle generation complete"
   - Confirm localhost:4200 is reachable
   - Record terminal handle for cleanup

3. **Perform health checks (non-blocking):**
   - Attempt fetch to http://localhost:4200/ (expect 2xx or 3xx redirect)
   - Attempt fetch to http://localhost:3000/db.json if json-server running (expect 2xx)
   - Log any connection failures

4. **Return:**
   - [ngServeTerminalId: string, jsonServerTerminalId: string|null, ngServeHealth: "healthy"|"error", jsonServerHealth: "healthy"|"not-running"|"error"]

---

### Task C: Runtime Error Audit (Chrome DevTools)
**Trigger:** After Task B completes successfully  
**Depends on:** ng serve running (Task B)  
**Input:** Application home page URL (localhost:4200)  
**Output:** Console error/warning log, error categorization

**Process:**
1. **Open Chrome DevTools MCP to http://localhost:4200**
2. **Capture console messages:**
   - Log all errors (red), warnings (yellow), and info (blue) messages
   - Filter for Angular-specific warnings: signal validation, OnPush mismatches, hydration errors, zone-related deprecations
   - Record message type, text, source line

3. **Check Application state:**
   - Verify page loaded without blank/error screen
   - Check for visual glitches or missing styles

4. **Categorize findings:**
   - **Critical:** Breaks functionality (console errors)
   - **Warning:** Deprecations or breaking-change notices
   - **Info:** Performance suggestions or feature availability notices

5. **Return:**
   - [homePageErrors: [], homePageWarnings: [], appHealth: "functional"|"degraded"|"broken"]

---

### Task D: Route-Specific Testing (/demos)
**Trigger:** After Task B completes successfully  
**Depends on:** ng serve running (Task B)  
**Input:** Application URL, demo route path  
**Output:** Route-specific errors, component rendering issues

**Process:**
1. **Navigate to http://localhost:4200/demos**
2. **Capture console messages** (same approach as Task C)
3. **Check rendering:**
   - Verify demo list loads
   - Spot-check first 3 demo routes for load errors
   - Look for component initialization failures

4. **Look for Angular v20+ compatibility issues:**
   - Signal input/output mismatches
   - OnPush change detection issues
   - Hydration errors (if SSR enabled)
   - Missing imports/providers

5. **Return:**
   - [demoPageErrors: [], demoPageWarnings: [], demoComponentsStatus: "functional"|"degraded"|"broken", affectedRoutes: []]

---

### Task E: Deprecation & Compatibility Check
**Trigger:** After Task D completes  
**Depends on:** Dev console data from Tasks C & D  
**Input:** Collected console logs, breakingChanges from Task A  
**Output:** Structured list of code changes needed, refactoring priority

**Process:**
1. **Cross-reference console warnings with breaking changes:**
   - Match deprecation messages to code locations
   - Identify patterns (e.g., "N components use old `@Input()` syntax")

2. **Categorize refactoring work:**
   - Pattern: anti-pattern found → modern replacement
   - Count: how many instances across codebase
   - Difficulty: estimate refactoring scope
   - Impact: does it block other tasks?

3. **Return:**
   - [refactoringTasks: [{ pattern, count, difficulty, impact }], estimatedEffort: "low"|"medium"|"high"]

---

### Task F: Zoneless Migration Analysis
**Trigger:** After Task E completes (or parallel if user wants early assessment)  
**Depends on:** Understanding of application structure  
**Input:** Project path, current Angular version, component analysis  
**Output:** Migration roadmap, prerequisites, risks, recommendations

**Process:**
1. **Audit current change detection:**
   - Scan all components for `ChangeDetectionStrategy.Default`
   - Count components using `@Input()`, `@Output()` (non-signals)
   - Identify services with `.subscribe()` in effects/constructors
   - Check for `NgZone` API usage (blocking patterns)

2. **Assess Signal API readiness:**
   - Are inputs/outputs using `input()` / `output()` signals?
   - Are services using `inject()` and signals for state?
   - Are templates using `@if`, `@for`, `@switch`?

3. **Generate migration prerequisites:**
   - Which components/services must be migrated first (dependency order)?
   - Are there 3rd-party libraries blocking zoneless adoption?
   - Configuration changes needed in `angular.json` or `main.ts`?

4. **Estimate effort:**
   - Number of components needing OnPush + signal migration
   - Complexity: high (many nested components) vs. low (simple state)
   - Risk: integration tests needed? E2E coverage sufficient?

5. **Return:**
   - [isZonelessReady: boolean, prerequisites: [], blockers: [], estimatedDaysOfWork: number, recommendedApproach: string]

---

### Task G: Optimization Recommendations
**Trigger:** After Task E completes  
**Depends on:** Code analysis, Angular v20+ capabilities  
**Input:** Component structure, performance baseline (if available), new Angular features  
**Output:** Markdown file with recommendations (do NOT implement)

**Process:**
1. **Identify optimization opportunities:**
   - Signal-based state management (vs. RxJS Subjects)
   - OnPush change detection + signal inputs (vs. Default + manual CD)
   - Control flow `@if/@for` (vs. `*ngIf/*ngFor`)
   - `httpResource()` for data fetching (vs. `toSignal()` + Observable)
   - Standalone components + tree-shaking benefits
   - Lazy loading routes with modern async syntax

2. **Prioritize by impact:**
   - **High:** Performance improvements, reduced bundle size, simpler code
   - **Medium:** Code clarity, maintainability improvements
   - **Low:** Nice-to-have refactoring, style consistency

3. **Structure output (`further-optimizations.md`):**
   ```markdown
   # Further Optimization Opportunities
   
   ## High-Impact Changes
   - [Change 1]: Benefit + effort estimate
   - [Change 2]: Benefit + effort estimate
   
   ## Medium-Impact Changes
   - ...
   
   ## Low-Impact Changes
   - ...
   ```

4. **Return:**
   - [recommendationsGenerated: true, fileWritten: "further-optimizations.md"]

---

## Dependent Execution Tasks

### Task H: Refactoring (Conditional, requires user approval)
**Trigger:** User reviews Task E findings and approves refactoring  
**Input:** Refactoring plan from Task E + user approval scope  
**Output:** Code changes applied, test results

**Process:**
- Only execute patterns user explicitly approved
- Apply bulk refactoring (e.g., `toSignal → httpResource`) across codebase
- Run tests after major changes to ensure no regressions

---

### Task I: Zoneless Migration (Conditional, requires user approval)
**Trigger:** User reviews Task F findings and approves migration  
**Input:** Migration roadmap from Task F + user approval  
**Output:** Code changes applied, `migrate-zoneless.md` written, tests pass

**Process:**
1. **Apply prerequisites from Task F** (e.g., enable experimental zoneless flag)
2. **Migrate components in dependency order** (from Task F roadmap)
3. **Update configuration** (angular.json, main.ts)
4. **Run test suite** to confirm no regressions
5. **Write findings to `migrate-zoneless.md`:**
   - What was changed
   - Configuration updates required
   - Testing results
   - Known issues or limitations

---

### Task J: Package.json Version Update
**Trigger:** After all refactoring/migration complete (or skip if none needed)  
**Input:** New Angular version from Task A  
**Output:** package.json updated

**Process:**
- Update version field in root `package.json` to reflect new Angular version
- Commit-ready (user can commit if desired)

---

### Task K: Cleanup
**Trigger:** User exits or final step  
**Input:** Terminal IDs from Task B  
**Output:** All servers shut down

**Process:**
1. Kill ng serve terminal (if started)
2. Kill json-server terminal (if started)
3. Confirm shutdown
4. Log: "Development environment cleaned up"

---

## Execution Summary Table

| Phase | Tasks | Parallelizable | User Action |
|-------|-------|---|---|
| **Setup** | Identify project + detect deps | — | Provide path if needed |
| **Upgrade** | A, B | ✅ A ∥ B | Wait for completion |
| **Audit** | C, D, E | ✅ C ∥ D, then E | Review findings |
| **Analysis** | F, G | ✅ F ∥ G | Review recommendations |
| **Refactor** | E (optional) | — | Approve/decline each pattern |
| **Migrate** | F (optional) | — | Approve zoneless approach |
| **Finalize** | J, K | — | Automatic |

---

## Key Behaviors

### Important Notes

- **Terminal Management:** Use VS Code integrated terminal only. Keep terminal handles from Task B for reliable cleanup in Task K.
- **Conditional Execution:** Tasks H, I only run with explicit user approval after audit results are presented.
- **Non-Breaking:** Tasks C, D, E do not modify code; they report findings for user review.
- **Parallel Speed:** Tasks A + B run in parallel (save 5-10 min upgrade time). Tasks C, D also parallel after B completes.
- **Error Recovery:** If Task B fails (server won't start), halt and ask user to investigate; do not proceed to auditing tasks.
