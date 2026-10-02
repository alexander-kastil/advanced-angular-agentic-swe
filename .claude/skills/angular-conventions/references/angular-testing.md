# Writing Angular specs with Vitest

Author unit tests for Angular components, services, guards and signals with Vitest and `TestBed`.

This leaf answers "how do I write a spec for this thing". Three siblings answer the other questions:

| Arrival question | Leaf |
| --- | --- |
| How do I run the suite, and why does the run look wrong? | [`angular-test-execution`](angular-test-execution.md) |
| Where are the coverage gaps and how do I close them? | [`angular-test-coverage`](angular-test-coverage.md) |
| The spec fails for a reason that is not the code under test | [`angular-test-doubles`](angular-test-doubles.md) |

| You want to... | Read |
| --- | --- |
| Component spec: where the `.spec.ts` goes and what to name it, TestBed setup, `setInput`, driving real DOM events. | [angular-testing-component](angular-testing-component.md) |
| The spec throws `NG0201: No provider found for ActivatedRoute`, or the template uses `routerLink` / `routerLinkActive`. | [angular-testing-router-provider](angular-testing-router-provider.md) |
| HTTP service spec, or a functional `CanActivateFn` / `CanMatchFn` guard that calls `inject()`. | [angular-testing-services-guards](angular-testing-services-guards.md) |
| Test a computed signal or effect with no TestBed, or code with timers and observables (`fakeAsync`, `tick`, `done`). | [angular-testing-signals-async](angular-testing-signals-async.md) |

Call `httpMock.verify()` in `afterEach` of **every** HTTP spec, not just the first one.

## A spec can be pinned to a shape the app never produces

Four specs in one repo had been red since before anyone looked, and every agent passing through
reported them as "pre-existing failures" and moved on. They were two real defects.

- Three pinned a tint that followed the row's BALANCE SIGN while the component coloured by ACCOUNT
  TYPE. Both had existed side by side since the last commit; the spec's own title and comments were
  the only written statement of intent, and nobody had implemented it.
- One was a deliberate tripwire ("keeps the KPI row count and every Label string unchanged, so a
  future rename fails here") pinned to 13 labels while the store emitted 16. The three extra rows are
  behind feature flags, and the spec flushed `FeatureFlags: { Flags: {} }`, which fell through to
  `FEATURE_FLAG_DEFAULTS` where both flags are `true`. The test was pinned to the flags-off shape
  while running with them on.

**Rules:**

- "Pre-existing failure" says when, not whether it matters. Read the assertion once before carrying
  it through a whole refactor as noise. A long-red spec is usually a defect nobody decoded.
- **A test that pins a shape must pin the inputs that produce it.** Flush the feature flags, the
  clock and the device tier explicitly; never inherit a default that can change under the test. The
  failure mode is silent for months and then blamed on whoever is passing through.
- When a spec and the code disagree and both predate the session, the spec's name and comments are
  usually the intent. Decide which is right, state what changes on screen, and never delete the test
  to get green.
