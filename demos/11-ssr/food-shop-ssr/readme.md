# food-shop-ssr

A hybrid-rendered Angular 22 food shop plus a demo browser for the module's seven topics. The catalog and the
three detail pages are prerendered at build time, everything else is server-rendered by Express 5, and the
browser hydrates one block at a time.

See [../readme.md](../readme.md) for the guided walkthrough. This file is the map of the app.

## Run It

```bash
npm install
npm run api                        # json-server on http://localhost:3010, serves /demos and /food
npm start                          # SSR dev server on http://localhost:4200
npm test                           # Vitest via @angular/build:unit-test, 19 specs

npm run build                      # prerenders 4 routes, emits the Express 5 server
npm run serve:ssr:food-shop-ssr    # http://localhost:4000
```

`npm start` already serves server-rendered HTML. It is not a client-only baseline.

The API is optional. With it stopped, `offline-catalog.interceptor.ts` answers `/food`, `/food/:id` and
`/demos` from bundled copies, so the build, the prerender and the running app all still work.

## Layout

| File                                       | Role                                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `src/app/app.routes.ts`                     | Client routes: `''`, `food/:id`, and the lazy `demos` children              |
| `src/app/app.routes.server.ts`              | Render mode per route, plus `getPrerenderParams()` for `food/:id`           |
| `src/app/app.config.ts`                     | `provideHttpClient()`, `provideRouter(..., withComponentInputBinding())`, `provideClientHydration(withEventReplay())` |
| `src/app/app.config.server.ts`              | `provideServerRendering(withRoutes(serverRoutes))`                          |
| `src/app/offline-catalog.interceptor.ts`    | Substitutes the bundled catalogs when the API is unreachable                |
| `src/app/food/food.data.ts`                 | `FALLBACK_FOOD`, the bundled catalog used at prerender time                 |
| `src/app/food/food.service.ts`              | Guarded `fetch` used by `getPrerenderParams()` and by `resource()`          |
| `src/app/food/food-list/`                   | Catalog page: `httpResource()` + `@defer (hydrate on viewport)` per card    |
| `src/app/food/food-details/`                | Detail page: route param signal drives the `httpResource()` url             |
| `src/app/food/shop-item/`                   | Product card, `linkedSignal()` mirrors the cart quantity                    |
| `src/app/demos/demo.routes.ts`              | One lazy child route per `db.json` demo row                                 |
| `src/app/demos/demo-container/`             | Sidebar, guide pane, `demo.data.ts` offline mirror of the catalog           |
| `src/app/demos/samples/<url>/`              | One folder per demo, named after its `url`                                  |
| `src/app/shared/markdown-renderer/`         | Renders `public/markdown/<md>.md`, browser only, `ngSkipHydration`          |
| `src/app/shared/code-panel/`                | Small code listing used across the samples                                  |
| `src/app/shared/number-picker/`             | Quantity stepper                                                            |
| `src/app/shared/euro.pipe.ts`               | Currency formatting                                                         |
| `public/markdown/`                          | Seven guides, one per demo row, served as static assets                     |
| `server.ts`                                 | Express 5 + `AngularNodeAppEngine`                                          |
| `db.json`                                   | json-server seed: `demos` (seven rows) and `food` (three dishes)            |

`db.json` is the API seed for this app. It carries both collections, so one `npm run api` feeds the shop and
the demo browser.

## Demo Rows

| # | Route | Guide |
| - | ----- | ----- |
| 1 | `/demos/server-routes` | `public/markdown/server-routes.md` |
| 2 | `/demos/node-app-engine` | `public/markdown/node-app-engine.md` |
| 3 | `/demos/incremental-hydration` | `public/markdown/incremental-hydration.md` |
| 4 | `/demos/transfer-cache` | `public/markdown/transfer-cache.md` |
| 5 | `/demos/route-params-signals` | `public/markdown/route-params-signals.md` |
| 6 | `/demos/csr-vs-ssr-delta` | `public/markdown/csr-vs-ssr-delta.md` |
| 7 | `/demos/karma-to-vitest` | `public/markdown/karma-to-vitest.md` |

## Render Modes

| Route      | Mode                     | Result                                                     |
| ---------- | ------------------------ | ---------------------------------------------------------- |
| `/`        | `Prerender`              | `dist/food-shop-ssr/browser/index.html`                    |
| `/food/:id`| `Prerender` + params     | `/food/1`, `/food/2`, `/food/3` written at build time      |
| `/food/99` | `PrerenderFallback.Server` | Rendered on demand by the Express server                  |
| `/demos/*` | `Server`                 | SSR per request, matched by the `**` route                 |
| `**`       | `Server`                 | SSR                                                        |

## Configuration Worth Knowing

- `angular.json` needs `"outputMode": "server"` or `app.routes.server.ts` is ignored entirely.
- `angular.json` needs `security.allowedHosts` or the server answers `400 Bad Request` on every request.
- `"polyfills": []` and no `zone.js` dependency: this app is zoneless.
- `provideMarkdown()` sits on the lazy `demos` route, not in `app.config.ts`. In the root config it pulls
  `marked` into the initial bundle and the 550 kB budget fails.
- The markdown renderer is browser only and carries `ngSkipHydration`: its `[src]` fetch is a relative URL,
  which `HttpClient` cannot resolve during server rendering.
