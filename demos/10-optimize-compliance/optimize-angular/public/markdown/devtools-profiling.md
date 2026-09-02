# Profile with Angular DevTools

## Two tools, two questions

| Tool | Answers | Install |
| --- | --- | --- |
| Angular DevTools extension, Profiler tab | *Which component* is being checked, and how often | Chrome Web Store, "Angular DevTools" |
| Chrome DevTools, Performance panel | *How long* everything took, and what the browser did with it | Built into Chrome |

Use them in that order. Find the component with Angular DevTools, then measure it with the Performance
panel.

## The v22 bridge between them

`@angular/core` exports `enableProfiling()`. It sends Angular's internal change detection events into
the Chrome Performance panel, so a recording gains an **Angular** track alongside Main, Interactions,
Timings and Layout Shifts.

```ts
import { enableProfiling } from '@angular/core';

const stop = enableProfiling();
// record, click, stop recording
stop();
```

Two facts worth stating exactly:

- It returns the stop function. Keep it and call it, otherwise every change detection pass for the rest
  of the session pays the instrumentation cost. The demo stores it and calls it in `DestroyRef.onDestroy`.
- It is a **development-mode** feature. In an optimized production build it is a no-op. The demo prints
  `isDevMode()` so you can see which build you are looking at.

## Recording a useful profile

1. Serve the app the way users get it, not the dev server: `npm run build`, then serve `dist/`.
2. Open the Performance panel. Set CPU throttling to 4x and network to Fast 3G. An unthrottled desktop
   trace hides almost everything a real user feels.
3. Tick **Screenshots**. The filmstrip is how you find the frame where the page looked broken.
4. Call `enableProfiling()` (or press the demo's button) *before* pressing record.
5. Record, do exactly one thing, stop. One interaction per recording. Two changes in a trace and you
   cannot attribute the delta.

## Reading the recording

| What you see | Track | Usual cause | Usual fix |
| --- | --- | --- | --- |
| One long block of change detection | Main / Angular | A costly expression called from a template, so it runs on every pass | Move it into a `computed()` |
| Many short change detection bars in a row | Angular | A signal written in a loop, or an effect writing what another effect reads | Batch the writes, derive with `computed()` |
| A component reappearing in passes you did not touch | Angular | The view is marked dirty from a parent, or object identity changes on every read | Give `@for` a stable `track`, stop rebuilding arrays in getters |
| A wide flame under Recalculate Style or Layout | Main | The template writes layout-affecting styles during render | Use the `afterEveryRender` phases: `earlyRead`, `write`, `read` |
| A gap between the click and the next paint | Interactions | The main thread was busy when the event arrived | Split the work, defer it, or move it off the main thread |

## Marking your own work

`performance.mark` and `performance.measure` put named bars on the **Timings** track, which is how you
label your own code inside someone else's flame chart.

```ts
performance.mark('render:start');
doTheWork();
performance.mark('render:end');
performance.measure('render', 'render:start', 'render:end');
```

Chrome also accepts an extended `console.timeStamp(label, start, end, trackName, trackGroup, color)` that
draws a bar on a custom track of your own. The typings for it ship with `@angular/core` in v22, which is
how Angular draws its own track.

A measure covers the synchronous handler only. The render it schedules lands afterwards, which is exactly
why the Angular track matters more than the number your own measure prints.

## Profiling from an agent

The `chrome-devtools` MCP server can drive this loop without a human at the keyboard, with one important
caveat about which tool to call:

- **`performance_start_trace` / `performance_stop_trace`** is the tool for performance work. It records a
  real Chrome trace, and `performance_analyze_insight` reads a named insight out of it (LCP breakdown,
  render blocking, document latency, and so on).
- **`lighthouse_audit` does not include the performance category.** It runs the accessibility,
  best-practices and SEO categories. Asking it for a performance score is asking for something it does not
  produce. Use it for the compliance categories, and use `performance_start_trace` for anything about
  speed.

## Checklist

- Profile a production build, throttled, one interaction at a time.
- Stop the profiling integration when you are done with it.
- Fix the widest bar, not the deepest one. Depth is call structure; width is time.
- Re-record after every fix. A remembered baseline is not a baseline.

## Where this sits in the module

`lighthouse` measures the outcome (LCP, INP, CLS). This demo finds the cause. Module 12 does the same
measurement against a deployed origin; here everything runs against a local build.
