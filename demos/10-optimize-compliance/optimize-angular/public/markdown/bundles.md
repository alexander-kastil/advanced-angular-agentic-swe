# Optimize Bundles with Rolldown

## The v22 build pipeline

`@angular/build:application` is the only application builder in Angular 22. Since v21 it bundles with
**Rolldown**, the Rust bundler from the Vite team, instead of the esbuild bundler.

| Stage | Tool | Role |
| --- | --- | --- |
| Parse | `oxc-parser` | Rust parser feeding the Angular compiler |
| Compile | `@angular/compiler-cli` | AOT template compilation, signal inputs, partial evaluation |
| Bundle | **Rolldown** | Module graph, code splitting, tree shaking, chunk emission |
| Transform | `esbuild` | Per-file downleveling and minification |
| Serve | `vite` | Dev server with Rolldown-backed prebundling |

esbuild has not disappeared: it is still the transformer. What changed is who owns the module graph, and
with it the quality of the code splitting.

> The `browser-esbuild` and `browser` builders are gone. So is the `webpack-bundle-analyzer` workflow
> that depended on a webpack `stats.json`.

## Budgets

Budgets turn a size regression into a failed build. This app configures them in `angular.json` under the
production configuration:

```json
"budgets": [
  { "type": "initial", "maximumWarning": "1MB", "maximumError": "2MB" },
  { "type": "anyComponentStyle", "maximumWarning": "4kB", "maximumError": "8kB" }
]
```

Budget types worth knowing:

- `initial` covers everything required before the first render. This is the one that decides LCP.
- `allScript` and `all` cover the whole output including lazy chunks.
- `bundle` with a `name` targets a single named chunk.
- `anyComponentStyle` catches a stylesheet that grew out of hand.

Set `maximumWarning` slightly above today's size so any growth is visible, and `maximumError` at the
size you are actually unwilling to ship.

> This app currently trips its own `initial` warning: the demo shell pulls in Angular Material, the
> markdown editor, Prism and Mermaid. That warning in the build output is the mechanism working. Either
> the shell gets lighter or the number gets justified and raised, deliberately.

## Find what is big

```bash
npm run build
npx source-map-explorer dist/optimize-angular/browser/*.js
```

`source-map-explorer` reads the emitted source maps and shows every module's contribution to each chunk.
Look for three things: a library imported for one function, the same library bundled twice under
different versions, and a locale or icon set pulled in whole.

## Keep it out of the initial chunk

The single most effective change is not making a library smaller, it is making it lazy.

```typescript
async loadHeavyLibrary() {
  const moment = (await import('moment')).default;
  this.stamp.set(moment().format('MMMM Do YYYY'));
}
```

Rolldown sees the dynamic `import()` and emits a separate chunk. Nothing downloads until the method
runs. The same applies to routes (`loadComponent`) and to template regions (`@defer`).

## Checklist

- Lazy load every route. Only the shell and the landing route belong in the initial chunk.
- Prefer deep imports and tree-shakable libraries over barrel imports of a whole toolkit.
- Replace `moment` with `date-fns` or the `Intl` API. It is deprecated and it does not tree shake.
- Keep `@defer` around anything below the fold.
- Check `dist/optimize-angular/browser` after every dependency addition.
