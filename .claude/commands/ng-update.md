Upgrade the Angular application at $ARGUMENTS to the latest version using an orchestrated flow.

## Orchestration Flow

Run Tasks A and B in parallel, then C/D/E after servers are up, then F/G for analysis.

### Task A: Core Dependencies Upgrade (parallel with B)

1. Read `package.json` - detect Angular version, Material, CDK, NgRx
2. Run upgrade commands in order:
   ```bash
   ng update @angular/core @angular/cli
   ng update @angular/material   # if present
   ng update @angular/cdk        # if present
   ng update @ngrx/store @ngrx/effects  # if NgRx present
   ```
3. Use `--allow-dirty` only if workspace has uncommitted changes

### Task B: Dev Environment Setup (parallel with A)

1. If `db.json` exists: run `json-server --watch db.json` in background
2. Run `ng serve`, wait for "Application bundle generation complete"
3. Verify localhost:4200 is reachable

### Task C: Runtime Error Audit (after B)

Open app in browser, capture all console errors/warnings. Categorize: Critical / Warning / Info.

### Task D: Route Testing (after B, parallel with C)

Navigate to `/demos` route. Check for component load errors, signal mismatches, missing imports.

### Task E: Deprecation Analysis (after C & D)

Cross-reference console warnings with breaking changes. Categorize refactoring by severity.

Anti-pattern registry:

| Anti-pattern | Severity |
|---|---|
| `@Input()` / `@Output()` decorators | Critical |
| `*ngIf` / `*ngFor` / `*ngSwitch` | Critical |
| `async pipe + Observable` for HTTP | High |
| `toSignal(http.get(...))` | High |
| `BehaviorSubject` for local state | Medium |
| Constructor injection | Medium |
| `ChangeDetectionStrategy.Default` | Medium |

### Task F: Zoneless Migration Analysis (after E, parallel with G)

- Scan components for `ChangeDetectionStrategy.Default`
- Count `@Input()`/`@Output()` decorators (non-signals)
- Check for `NgZone` usage
- Generate migration prerequisites and effort estimate

### Task G: Optimization Recommendations (parallel with F)

Generate `further-optimizations.md` with high/medium/low impact changes.

## Key Rules

- Tasks H (refactoring) and I (zoneless migration) require **explicit user approval** before executing
- If `ng serve` fails, stop and ask user to investigate - do not proceed
- Kill all dev servers when done (cleanup task)
- Present full findings report before making any code changes
