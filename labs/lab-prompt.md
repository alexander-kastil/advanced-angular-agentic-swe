/create-class

Use that skill for this entire job, and read its leaves before writing anything:

- `SKILL.md`, the master and its cross-cutting rules
- `references/create-guide.md`, for authoring every lab guide, format prompt-recipe
- `references/verify-by-execution.md`, for the execution audit of every finished guide
- `scripts/link-check.sh`, for link verification
- `.claude/skills/brand-voice-code/` in this repo, for the voice pass after every guide edit

Follow those files. Do not paraphrase a leaf into your own brief, and do not invent a process
they do not describe. Nothing in create-class says write a workflow script, so do not write one.

Job: build labs 1 to 12 for the Angular Agentic Software Engineering course at
`D:\git-classes\angular-agentic-swe`. Work lab by lab. Do not start lab N+1 until lab N is
finished and proven.

## What already exists and must NOT be rebuilt

- `labs/secrets-vault-mcp/` is the backend, done and verified: ASP.NET Core on SQLite, Entra
  removed, users in the database with BCrypt plus a local JWT, `Auth:Enabled` false by default,
  no EF migrations, no SixLabors.ImageSharp. Schema and seed are hand-written SQL at
  `db/secrets-vault-mcp/create-schema.sql` and `load-data.sql`. Seed: 5 lists (3 Secrets,
  2 Vault), 28 secrets, one with 3 versions, categories with colours. Users:
  `owner` / `Owner#Vault2026!` and `customer` / `Customer#Vault2026!`. The image builds from the
  repo root: `docker build -f labs/secrets-vault-mcp/Dockerfile .`. Read it, never edit it,
  never design backend work.
- `demos/readme.md` carries the class schedule under `## Schedule`. It is the source of truth
  for how long every lab may run. Read it before writing any guide.
- `.claude/skills/brand-voice-code/` is the repo house voice.

## Current state of labs/

`labs/lab-01/` contains only a `readme.md` left over from a rejected attempt, and no app folder.
Delete that readme and start lab 1 from nothing. `labs/lab-02/` through `labs/lab-12/` do not
exist yet. `labs/lab-*-old/` is the previous food-app track, kept for reference only: read it for
the starter-to-solution convention, never edit it, never carry its content forward.

## The app

Display name, wherever a human reads it: **Secrets and Document Vault**. Never shorten it.
Slug, wherever a machine reads it: `secrets-vault`.

Folders: `labs/lab-NN/lNN-secrets-vault-starter` and `labs/lab-NN/lNN-secrets-vault-solution`,
where NN is that lab's own zero-padded number. Lab 1 has no starter, the app is created there.
Lab N's solution is copied verbatim as lab N+1's starter, exactly like `labs/lab-*-old`.
The lab guide is `labs/lab-NN/readme.md`, at the root of the lab folder.

The app rebuilds parts of the real secrets-ui at
`D:\git-projects\integrations.at\src\secrets-ui`. That path is a read-only reference for you and
students do not have it, so never link it from a guide. The subject is secrets and vaults: lists,
secrets, versions, categories, vault files. No food sample, no other domain.

## The twelve labs

Minutes come from `demos/readme.md` `## Schedule` and are a ceiling, not a target. A lab that
overruns steals the next module's teaching block.

| # | Module | Min | Angular focus | What gets built in the app |
|---|---|---|---|---|
| 1 | 01-agentic-dev | 40 | CLI MCP, CLAUDE.md/AGENTS.md, skills, subagent, hooks | ng new the workbench, start the secrets-mcp container, register it as an MCP server, first screen: the secret lists |
| 2 | 02-signals | 40 | signal/computed/effect, linkedSignal, model, httpResource, debounced | Lists overview + secrets list via httpResource, debounced search over ?search=, mask/reveal as a signal |
| 3 | 03-components | 35 | signal queries, projection, directive composition, @defer, aria | Split the page into list/detail with a splitter, secret row, category chip strip, reusable masked-value + copy control, accessible overflow popover |
| 4 | 04-signal-forms | 35 | form(), validators, validateHttp, arrays, error state | Secret detail editor as a Signal Form over UpdateSecret; validateHttp for the per-list name collision; categoryIds array capped at 3; one Save = one PUT |
| 5 | 05-reactive | 30 | flattening, custom operators, interop, rxResource | Vault upload: POST /secrets/upload with reportProgress mapped to a progress signal; export blob; retry/backoff; rxResource for version history |
| 6 | 06-ngrx-signals | 35 | withState/Computed/Methods/Entities, withFeature, events | Replace ad-hoc signals with a SecretsStore of withLists + withSecrets + withCategories, written with withEntities |
| 7 | 07-routing-app-init | 35 | appInitializer, functional guards, interceptors, resolvers, view transitions | The real route table: /secrets/:listId/:id, /secrets/:listId/full/:id, /vaults/:listId, per-route resolvers, first-list guard, auth guard, API-key interceptor |
| 8 | 08-testing | 35 | Vitest, signal inputs, store tests, zoneless async, Playwright | Specs for the service, the store features and the 409 form path; a Playwright run that creates, renames and deletes a secret; agent writes them, mutation proves them |
| 9 | 09-webmcp | 30 | signals/components/forms/store/router as agent tools | Expose the workbench to an agent: list lists, search, open a secret, drive the signal form, navigate. Plus the security lesson: reveal and export are not exposed |
| 10 | 10-optimize-compliance | 30 | Lighthouse, budgets, @defer triggers, virtual scroll, WCAG 2.2 AA | Virtual-scroll a large list, defer the version history and category manager, budgets, aria on the masked control and dialogs, a PR gate |
| 11 | 11-ssr | 30 | RenderMode per route, incremental hydration, transfer cache | The teaching point is choosing: prerendered shell and login, SSR the lists overview, client-only secret detail (never SSR a password), transfer cache on the lists resource |
| 12 | 12-agentic-devops | 35 | deployment agent, Ubuntu box, Caddy, DNS, CWV loop | Multi-stage image, composed beside the given secrets-mcp container, Caddy with TLS, deploy through the agent, verify live |

Labs 1 to 3 run with `Auth__Enabled=false` and must not build a login, an auth guard, an
interceptor or token handling. That arrives in lab 7 with routing and resolvers.

## Rules for the guides, on top of create-guide.md

- NEVER reproduce a file that already exists on disk. Point the agent at the path. A Recipe that
  pastes forty lines of TypeScript for the learner to copy is a typing exercise, not an agentic
  lab. The domain model is produced by reading the C# records under
  `labs/secrets-vault-mcp/Contracts/` and generating the TypeScript.
- A code block earns its place only when the syntax is the lesson and there is nothing to point
  at: a hook script, the `.mcp.json` shape, a skill invocation, a signal API not met before.
- The minute ceiling above is hard. 4 or 5 steps. Compress by counting model round trips: one
  prompt producing six files beats six prompts producing one each.
- Default to recipe-only steps. At most one five-part step per lab, and only where the learner
  faces a real decision.
- Do not invent skills, agents, endpoints, fields or rules. Where a skill is taught, demonstrate
  a real one: lab 1 demonstrates `ui-ux-pro-max` and its output IS the design system for all
  twelve labs, so do not hand-pick a palette.

## Prove every lab before moving on, per verify-by-execution.md

- Execute the finished guide as a learner who has only the guide and the starter, with no access
  to the solution. Work its defect taxonomy, feed hooks their real stdin payload, drive
  `.mcp.json` over JSON-RPC, and use its honesty table: Verified, Preconditions verified,
  Not executed.
- Fix every blocking defect at the cause. Never by deleting a step, weakening an expected
  outcome, or pushing the lab past its minute ceiling.
- Re-execute to prove the fix. A finding that was fixed but not re-executed is still open.
- Run `link-check.sh` and report `broken=` and `missing_readme=` verbatim.
- Only then cut lab N+1's starter from lab N's solution.

## Hard constraints

- Never commit, stage or push. Never `git checkout --`, `restore`, `stash` or `reset`.
- Never leave `node_modules`, `.angular` or `dist` anywhere under `labs/`. Install in a temp
  directory if you need to build.
- No code comments. No documentation beyond the lab guides.
- No em dashes.
- Do not write a workflow script, a helper script, or any scratch file into the repo.
- Ask nothing that the request, the repo or an existing sibling already answers. Do not report
  observations nobody asked for.

Start with lab 1. Show me the guide when it has passed execution.
