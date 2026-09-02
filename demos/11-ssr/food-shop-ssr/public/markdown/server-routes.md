- `app.routes.server.ts` assigns a `RenderMode` to every route. It is a separate file from `app.routes.ts` because the browser bundle must never import `@angular/ssr`.

```typescript
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: 'food/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      const catalog = await inject(FoodService).getCatalog();
      return catalog.map((item) => ({ id: String(item.id) }));
    },
  },
  { path: '**', renderMode: RenderMode.Server },
];
```

- The three modes:
    - `RenderMode.Prerender` renders at **build time** into a static HTML file
    - `RenderMode.Server` renders **per request** inside the Node process
    - `RenderMode.Client` ships the shell and renders in the browser, the classic CSR path

- A parameterised route cannot be prerendered without knowing the parameters. `getPrerenderParams()` supplies them, runs in an injection context, and may be `async`.

- `fallback` decides what happens to a parameter the build did not know about:
    - `PrerenderFallback.Server` renders it per request (used here)
    - `PrerenderFallback.Client` serves the CSR shell
    - `PrerenderFallback.None` returns a 404

- Register the table in the **server** config only:

```typescript
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};
```

## The failure that gives no error

- `app.routes.server.ts` is silently ignored unless `angular.json` sets `outputMode: "server"`. Without it the builder falls back to the legacy `prerender` option, `getPrerenderParams()` is never called, and the build reports `Prerendered 1 static route` with no warning.

```json
"options": {
  "server": "src/main.server.ts",
  "ssr": { "entry": "server.ts" },
  "outputMode": "server",
  "security": { "allowedHosts": ["localhost"] }
}
```

- `security.allowedHosts` is the second trap. Angular 22 validates the `Host` header against it, so a server built without it answers **400 Bad Request** to every request.

## Verifying it

```bash
npm run build
# expect: Prerendered 4 static routes
ls dist/food-shop-ssr/browser/food
# expect: 1  2  3
```

- The retired mechanism was `routes.txt` plus `"prerender": true`. Both are gone in 22; a leftover `routes.txt` is dead weight, not configuration.
