# Angular CLI, dev commands and deployment

## Code Generation


Use Angular CLI rather than hand-writing the initial file structure.

```bash
ng generate component my-component
ng generate service my-service
ng generate directive my-directive
ng generate pipe my-pipe
```

## Development Commands


| Command            | Use                                        |
| ------------------ | ------------------------------------------ |
| `ng serve`         | Start the local Angular development server |
| `ng build`         | Create a production build                  |
| `ng build --watch` | Rebuild continuously during development    |

## Environment files: `environment.ts` is the deployed default, never the dev file

Per Angular's own guidance (angular.dev/tools/cli/environments, checked against the v22 docs):
`src/environments/environment.ts` **is** the deployed/production default. Target-specific files such
as `environment.development.ts` override it through `fileReplacements` in the matching build
configuration in `angular.json`. Older projects (pre-v15 pattern) invert this: dev values sit in the
base `environment.ts`, and the deployed values live in a differently-named file such as
`environment.prod.ts` or `environment.box.ts`.

The tell that a project still carries the inversion: the `development` build configuration declares
no `fileReplacements` entry at all, so `ng serve` silently loads the base file, and the deployed
values live in a file named after the target, not after `environment.ts` itself.

```jsonc
// angular.json — correct direction
"configurations": {
  "production": {},                                          // no fileReplacements: environment.ts already holds deployed values
  "development": {
    "fileReplacements": [
      { "replace": "src/environments/environment.ts", "with": "src/environments/environment.development.ts" }
    ]
  }
}
```

To correct an inverted project: move the deployed values into `environment.ts`, put the dev values
into `environment.development.ts` with the `fileReplacements` entry above under `development`, and
drop any `fileReplacements` from `production` (it now has nothing to replace).

Two traps on the way:

- **A build configuration name can be pinned by something outside the workspace** (a Dockerfile
  passing `--configuration=box`, a CI step, a deploy script). Keep that configuration name even after
  its `fileReplacements` becomes empty; renaming it breaks every caller that is not `angular.json`.
- **Two deploy slots building from the same configuration must keep `apiUrl` same-origin.** Use `''`
  with call sites appending `/api/...`, or `/api` with call sites appending only the resource path.
  An absolute host baked into the shared `environment.ts` makes the second slot silently call the
  first slot's API.

Per-environment values that differ across containerized deploy slots are a different problem with a
different fix: see [`angular-runtime-config`](angular-runtime-config.md).

## Deployment Note


Angular projects in this repository are typically deployed to Azure Static Web Apps or Azure Container Apps. Use the project-specific deployment scripts and documentation instead of inventing a new deployment path.

Back to the index: [angular-conventions](../SKILL.md)
