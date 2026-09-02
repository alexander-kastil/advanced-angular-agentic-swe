- Angular DevTools can draw the **signal graph**: every reactive node in a component and the edges
  between them. It is the fastest way to answer "why did this recompute?" and "what does this feed?".

## Getting there

1. Install the Angular DevTools browser extension and open it on this page while `ng serve` runs.
   The graph is a **development-mode** feature; a production build strips the debug names.
2. Open the **Components** tab and select `app-devtools-signal-graph` in the tree.
3. Switch the right-hand pane to **Signals**. DevTools renders the component's reactive graph.

## The graph on this page

The demo builds five layers on purpose, so the picture is not a straight line:

```text
ticks   weight   running        (signal, writable sources)
   \      /         |
    score           |           (computed)
      |             |
     band           |           (computed)
     /  \           |
threshold  skillsByBand         (linkedSignal, httpResource)
     \       /                  |
      headline                  tickerEffect  (computed, effect)
```

- `running` feeds only `tickerEffect`, which writes `ticks` on a timer. That is the one **cycle-like**
  path in the graph, and DevTools shows it as an effect node writing back into a source.
- `band` fans out to two very different consumers: a `linkedSignal` you can override by hand, and an
  `httpResource` whose URL changes with it.
- `headline` is the sink: it depends on `band`, `threshold` and the resource's value, so it is the
  node that lights up most often.

## Reading it

| What you see | What it means |
| --- | --- |
| A node with no incoming edges | a writable `signal`, the root of a change |
| A node with incoming edges | `computed`, `linkedSignal` or a resource, derived state |
| A node highlighted after an interaction | it recomputed in that turn |
| A node **not** highlighted after an interaction | its dependencies compared equal, so it was skipped |
| A leaf effect node | a side effect; if it re-runs too often, an upstream `equal` is too loose |

- Press **Weight** repeatedly with the ticker stopped. `score` and `band` recompute, but `band`
  often lands on the same string, so `threshold`, `skillsByBand` and `headline` stay quiet. That is
  glitch-free propagation and value equality doing their job, and the graph shows it directly.
- Press **Override threshold**. `threshold` changes without `band` changing, which is exactly what a
  writable derived signal is for. Then press **Weight** until the band flips and watch the manual
  override get discarded by the `computation`.

## Name your nodes

DevTools shows anonymous nodes as `[computed]` and `[signal]`, which makes a graph of ten nodes
unreadable. Every reactive primitive takes a `debugName`:

```typescript
readonly ticks = signal(0, { debugName: 'ticks' });
readonly score = computed(() => this.ticks() * this.weight(), { debugName: 'score' });
readonly threshold = linkedSignal({ source: ..., computation: ..., debugName: 'threshold' });
readonly skills = httpResource<Skill[]>(() => ..., { defaultValue: [], debugName: 'skillsByBand' });

effect((onCleanup) => { ... }, { debugName: 'tickerEffect' });
```

`debugName` is available on `signal`, `computed`, `linkedSignal`, `effect`, `resource`,
`rxResource` and `httpResource`. It is stripped from production builds, so there is no cost to
naming everything.

> The resource in this graph reads `http://localhost:3000/skills`. Run `json-server db.json` in the
> app folder to see it move between `loading` and `resolved`.
