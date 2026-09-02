# Harnesses in Browser Mode

A CDK component harness is an API over a component: `check()`, `getValueText()`, `clickOptions()`. It never mentions a CSS class, so it survives a Material upgrade, and it is environment agnostic: the same spec runs under jsdom and under Vitest browser mode with no edits.

## The spec

```typescript
loader = TestbedHarnessEnvironment.loader(fixture);
rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
```

Two loaders, and the difference matters as soon as an overlay is involved:

- `loader` searches inside the fixture's own element.
- `documentRootLoader` searches the whole document, which is where the CDK overlay container lives. A `mat-select` panel, a menu, a dialog and a snackbar are all outside the fixture.

`MatSelectHarness` hides that from you for its own panel:

```typescript
const select = await loader.getHarness(MatSelectHarness);

await select.open();
expect((await select.getOptions()).length).toBe(3);
await select.clickOptions({ text: 'weekly' });

expect(component.frequency()).toBe('weekly');
```

Every harness call is `async` because in browser mode it really does wait for the browser to settle. Write `await` even where jsdom would not need it, or the spec will pass locally and fail in browser mode.

## Filtering instead of selecting

```typescript
await loader.getHarness(MatCheckboxHarness.with({ label: 'Email' }));
await loader.getHarness(MatButtonHarness.with({ text: /Save preferences/ }));
```

`.with()` is the whole reason to use harnesses. Compare it to `By.css('.mat-mdc-checkbox:nth-child(2) input')`, which breaks on the next Material release and tells a reviewer nothing about intent.

## Running it in browser mode

The `@angular/build:unit-test` builder takes a `browsers` option. When it is absent, tests run in Node against jsdom; when it is set, they run in a real browser through Vitest browser mode.

```json
"test-browser": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "tsconfig.spec.json",
    "buildTarget": "vitest-testing:build",
    "browsers": ["chromium"]
  }
}
```

Vitest 4 ships each browser provider as its own package, so the provider `@vitest/browser` used to bundle is now `@vitest/browser-playwright`. It is already in this app's `devDependencies` and pulls `playwright` in with it.

The npm package is not the browser. Playwright downloads Chromium into a machine-wide cache, and that download is the one step a student has to run once:

```bash
npx playwright install chromium
```

Then:

```bash
npm run test:browser
```

which runs `ng run vitest-testing:test-browser`. Without the download the run fails with `Executable doesn't exist at ...ms-playwright\chromium-<build>`, not with a missing module.

The same 207 specs pass under both targets. `npm test` keeps them on jsdom; `npm run test:browser` puts them in Chromium. The spec files are identical in both runs, which is the point of the demo.

## What each environment can tell you

| | jsdom | browser mode |
| --- | --- | --- |
| Layout and geometry | every box is 0 by 0 | real layout, so overlay positioning and scrolling behave |
| Overlays | render into the container, never painted | painted and hit-testable, so a stray `z-index` actually fails |
| Animations | need `NoopAnimationsModule` | run, and the harness waits for stability anyway |
| Speed | milliseconds per spec | a browser start-up per run |

## How to choose

Run the suite under jsdom by default: it is fast enough to run on save. Switch the same files to browser mode when the thing you are testing depends on being painted, which in practice means overlays, focus and scroll behaviour, drag and drop, and anything that reads `getBoundingClientRect()`.

Because harnesses never touch the DOM directly, that switch costs a flag rather than a rewrite. A spec written with `By.css` and `nativeElement.click()` does not port.
