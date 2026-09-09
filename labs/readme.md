# Labs: Secrets and Document Vault

| # | Module | Angular focus | What gets built in the app |
|---|---|---|---|
| [1](./lab-01/) | 01-agentic-dev | CLI MCP, CLAUDE.md/AGENTS.md, skills, subagent, hooks | ng new the workbench, start the secrets-mcp container, register it as an MCP server, first screen: the secret lists |
| [2](./lab-02/) | 02-signals | signal/computed/effect, linkedSignal, model, httpResource, debounced | Lists overview + secrets list via httpResource, debounced search over ?search=, mask/reveal as a signal |
| [3](./lab-03/) | 03-components | signal queries, projection, directive composition, @defer, aria | Split the page into list/detail with a splitter, secret row, category chip strip, reusable masked-value + copy control, accessible overflow popover |
| [4](./lab-04/) | 04-signal-forms | form(), validators, validateHttp, arrays, error state | Secret detail editor as a Signal Form over UpdateSecret; validateHttp for the per-list name collision; categoryIds array capped at 3; one Save = one PUT |
| [5](./lab-05/) | 05-reactive | flattening, custom operators, interop, rxResource | Vault upload: POST /secrets/upload with reportProgress mapped to a progress signal; export blob; retry/backoff; rxResource for version history |
| [6](./lab-06/) | 06-ngrx-signals | withState/Computed/Methods/Entities, withFeature, events | Replace ad-hoc signals with a SecretsStore of withLists + withSecrets + withCategories, written with withEntities |
| [7](./lab-07/) | 07-routing-app-init | appInitializer, functional guards, interceptors, resolvers, view transitions | The real route table: /secrets/:listId/:id, /secrets/:listId/full/:id, /vaults/:listId, per-route resolvers, first-list guard, auth guard, API-key interceptor |
| [8](./lab-08/) | 08-testing | Vitest, signal inputs, store tests, zoneless async, Playwright | Specs for the service, the store features and the 409 form path; a Playwright run that creates, renames and deletes a secret; agent writes them, mutation proves them |
| [9](./lab-09/) | 09-webmcp | signals/components/forms/store/router as agent tools | Expose the workbench to an agent: list lists, search, open a secret, drive the signal form, navigate. Plus the security lesson: reveal and export are not exposed |
| [10](./lab-10/) | 10-optimize-compliance | Lighthouse, budgets, @defer triggers, virtual scroll, WCAG 2.2 AA | Virtual-scroll a large list, defer the version history and category manager, budgets, aria on the masked control and dialogs, a PR gate |
| [11](./lab-11/) | 11-ssr | RenderMode per route, incremental hydration, transfer cache | The teaching point is choosing: prerendered shell and login, SSR the lists overview, client-only secret detail (never SSR a password), transfer cache on the lists resource |
| [12](./lab-12/) | 12-agentic-devops | deployment agent, Ubuntu box, Caddy, DNS, CWV loop | Multi-stage image, composed beside the given secrets-mcp container, Caddy with TLS, deploy through the agent, verify live |
