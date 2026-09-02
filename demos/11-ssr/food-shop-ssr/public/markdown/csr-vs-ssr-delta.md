- The usual CSR-versus-SSR table in tutorials is invented. This one was measured against this app, and the commands are below so you can reproduce or contradict it.

## What was measured

- Production build of `food-shop-ssr`, served by `node dist/food-shop-ssr/server/server.mjs` on `localhost:4000`.
- Angular CLI 22.1.5, Node 24.15.0, measured 2026-09-02.
- json-server was **not** running, so every route took the bundled fallback catalog. That removes API latency from the comparison and makes the run repeatable.
- Seven warm requests per path, median reported. The first request of a cold process is discarded: it is 20-50 ms slower on every path and measures process warm-up, not rendering.

```bash
npm run build
node dist/food-shop-ssr/server/server.mjs

for p in / /food/2 /food/99 /index.csr.html; do
  for i in 1 2 3 4 5 6 7; do
    curl -s -o /dev/null -w '%{time_starttransfer} %{size_download}\n' \
      "http://localhost:4000$p"
  done
done
```

## The numbers

| Path | Render path | HTML payload | TTFB | Content in the first response |
|---|---|---|---|---|
| `/index.csr.html` | CSR shell | 68.1 kB | 1.7 ms | none, an empty `<app-root>` |
| `/` | prerendered at build time | 89.1 kB | 1.7 ms | all three dish names and prices |
| `/food/2` | prerendered at build time | 105.4 kB | 1.6 ms | the full Blini with Salmon card |
| `/food/99` | server rendered per request | 99.9 kB | 30.7 ms | the resolved "No dish found" branch |

## Reading it honestly

- **Prerendering is free at request time.** `/` and `/food/2` are files on disk served by `express.static`, so they are indistinguishable from the empty shell on TTFB while carrying the finished page.

- **Server rendering costs about 29 ms per request here.** That is the whole difference: 1.6 ms for a file versus 30.7 ms for a render. It is the price of a route whose output cannot be known at build time, and it scales with concurrency in a way a static file does not.

- **The CSR shell wins on bytes and loses on everything else.** It is 21 kB smaller than the prerendered homepage, and 21 kB is the entire content of the page. The user still waits for the bundle to download, parse, boot and fetch before seeing a dish.

- **These are localhost numbers.** No network, no TLS, no compression, no cold serverless container. Treat the *shape* as transferable and the absolute values as not.

## Getting a real CSR baseline

- `index.csr.html` is what the builder emits for client-fallback routes. Requesting it directly is the closest thing to a CSR measurement without building a second app.

- For a proper side-by-side inside one app, give one route the client render mode:

```typescript
{ path: 'csr-only', renderMode: RenderMode.Client }
```

- `ng serve` is **not** a CSR baseline for this app. The dev server runs the SSR pipeline: its responses contain `mat-toolbar`, the dish names and `ngh=` hydration markers. Verify before assuming:

```bash
npm start
curl -s http://localhost:4200/ | grep -c 'ngh='
```

## The live panel

- The second panel on this page reads `PerformanceNavigationTiming` from the browser, so it measures the document you are looking at.

- `navigation type: navigate` means the server produced this document. Arriving from the sidebar is a client-side navigation and leaves the original entry in place, so reload before reading it.
