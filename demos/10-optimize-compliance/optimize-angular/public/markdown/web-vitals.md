# Audit Core Web Vitals

## The metrics that count

| Metric | What it measures | Good | Poor |
| --- | --- | --- | --- |
| **LCP** Largest Contentful Paint | Time until the largest visible element is painted | <= 2.5 s | > 4 s |
| **INP** Interaction to Next Paint | Worst interaction latency across the visit | <= 200 ms | > 500 ms |
| **CLS** Cumulative Layout Shift | Unexpected movement of visible content | <= 0.1 | > 0.25 |
| **FCP** First Contentful Paint | Time until the first content pixel appears | <= 1.8 s | > 3 s |
| **TTFB** Time to First Byte | Server response latency for the document | <= 800 ms | > 1.8 s |

LCP, INP and CLS are the three Core Web Vitals. INP replaced FID in March 2024.

## Lab versus field

The demo reads **field** data: what actually happened in this browser, on this machine, over this
network. Lighthouse produces **lab** data: a scripted load under a simulated slow 4G connection and a
throttled CPU, which is reproducible and therefore useful in CI.

Both are needed. Lab tells you whether a change helped; field tells you whether users notice.

## Read the metrics in code

```typescript
const observer = new PerformanceObserver(list => {
  const entries = list.getEntries();
  const last = entries[entries.length - 1];
  lcp.set(Math.round(last.startTime));
});

observer.observe({ type: 'largest-contentful-paint', buffered: true });
```

`buffered: true` replays entries that were recorded before the observer existed, which matters for LCP
and FCP because they happen during bootstrap.

Disconnect every observer in `DestroyRef.onDestroy`. In a zoneless app the callback runs outside Angular
and the signal write is what schedules change detection.

## Run a Lighthouse audit

```bash
npm run build
npx http-server dist/optimize-angular/browser -p 4200
```

Then open DevTools, pick the Lighthouse panel, choose the mobile profile and audit Performance,
Accessibility, Best Practices and SEO. Never audit the dev server: unminified bundles and the HMR client
make the numbers meaningless.

For CI use the Lighthouse CLI and assert on the score:

```bash
npx lighthouse http://localhost:4200 --output=json --output-path=./report.json --chrome-flags="--headless"
```

## Auditing from an agent

The `chrome-devtools` MCP server can run this audit for you, but pick the right tool:

- **`performance_start_trace` / `performance_stop_trace`** is the tool for Core Web Vitals. It records a
  real Chrome trace with `reload` and `autoStop` options, and `performance_analyze_insight` pulls a named
  insight out of it (LCP breakdown, render blocking requests, document latency).
- **`lighthouse_audit` excludes the performance category.** It runs accessibility, best practices and SEO
  only. It will not give you an LCP, an INP or a performance score, so do not ask it for one; use it for
  the compliance categories in this module instead.

## What moves each number

- **LCP**: preload the hero image with `NgOptimizedImage` and `priority`, cut render-blocking CSS, keep
  the initial bundle small.
- **INP**: stop blocking the main thread. Long tasks over 50 ms are the usual cause. Split work, defer
  it, or move it to a worker.
- **CLS**: give every image and embed an explicit width and height, reserve space for banners, and never
  insert content above existing content after load.

## Try it in the demo

The two buttons deliberately create the defects: one blocks the main thread for 320 ms so INP rises, the
other inserts an unsized banner so CLS rises. Watch the rating badges change.
