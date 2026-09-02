# AI Writes the Test

Four steps, in this order. Skip any one of them and you get a suite that is green and worthless.

1. **You state the behaviour.** In sentences, not code.
2. **The agent writes the spec.** With `get_best_practices` and `run_target` from the Angular MCP server.
3. **You review it** against a fixed checklist.
4. **A mutation round proves it bites.** Break the code on purpose and watch the suite go red.

## 1. State the behaviour

The agent cannot know what the code is supposed to do. That is the one part of testing that is never bookkeeping, so it stays with you.

```text
Base rate per zone: domestic 4.90, EU 9.90, world 19.90.
Express doubles the base rate. It does not double the heavy surcharge.
Above 5 kg add a flat 5.00 plus 1.10 for every kilogram over 5. Exactly 5 kg is light.
Domestic orders from a subtotal of 100 ship free, unless express was chosen.
A weight of zero or less throws "Weight must be positive".
An unknown zone throws "Unknown zone".
Every quote is rounded to two decimals.
```

Seven sentences, and every one of them names a boundary or an exception. That is what makes a spec worth generating.

## 2. The prompt

```text
Call get_best_practices for this workspace first, then read shipping-rules.ts.
Write a Vitest spec next to it. Plain functions, no TestBed.
One it() per rule in the behaviour statement below, plus both sides of every
boundary: 5 kg, a subtotal of exactly 100, and express against free shipping.
Assert exact numbers and exact error messages. No snapshots, no toBeTruthy.
Run it with run_target target=test and paste the failing output before you fix anything.
```

Why each line is there:

- **`get_best_practices` first.** It is the Angular MCP tool that returns the version-specific rules for this workspace. Without it an agent reaches for Jasmine, `fakeAsync` and `@Input()`, because that is what most of its training data looks like.
- **A named file.** The agent reads the implementation instead of inventing an API.
- **A named runner and style.** `TestBed` for a plain function is noise.
- **The rule list.** Coverage is bookkeeping, and bookkeeping is what the agent is genuinely good at.
- **`run_target target=test`.** The other Angular MCP tool. The agent runs the suite itself, so "it passes" is an observation instead of a claim.
- **Paste the failing output first.** A spec that has never been red has never been tested.

## 3. Review the output

`shipping-rules.spec.ts` is what came back: fifteen `it()` blocks, one per rule plus the boundaries. Read it against this list before you keep it.

- One assertion per rule, and every rule from the statement is present.
- Both sides of each boundary are asserted, not just the happy side. `5` **and** `7`. `100` **and** `99.99`.
- Numbers are literals a reviewer can check by hand, never expressions copied out of the implementation.
- Errors are matched by message. A bare `toThrow()` passes on the wrong error.
- No test re-states the implementation. `expect(rates[zone]).toBe(rates[zone])` is green forever and proves nothing.
- The mutation round is green.

The failure mode to watch for is not a wrong assertion, it is a *tautological* one: the agent read the code, so it can trivially write a test that agrees with the code, bug included.

## 4. The mutation round

This is the step that converts a passing suite into evidence. `shipping-mutants.ts` holds eight copies of the implementation, each with exactly one rule broken:

| Mutant | The break |
| --- | --- |
| heavy boundary | `weightKg > 5` becomes `>= 5` |
| express doubles everything | the surcharge is doubled with the base rate |
| free express shipping | the free-shipping rule stops excluding express |
| free-shipping threshold | `subtotal >= 100` becomes `> 100` |
| free shipping everywhere | the zone check drops out |
| no rounding | the raw float is returned |
| silent unknown zone | returns `0` instead of throwing |
| weight guard off by one | `weightKg <= 0` becomes `< 0` |

`shipping-contract.ts` holds the same nine cases as plain functions so both the spec and the running demo page can use them, and `shipping-mutation.spec.ts` asserts the outcome:

```typescript
it.each(mutants.map((m) => [m.name, m] as const))('kills the "%s" mutant', (_name, mutant) => {
  const killedBy = runShippingContract(mutant.quote).filter((r) => !r.passed);
  expect(killedBy.length).toBeGreaterThan(0);
});
```

A mutant that survives is a hole in the suite, named and located. The demo page above runs the same eight mutants live and shows which case kills each one.

## Where the split falls

The agent enumerates: every branch, every argument shape, every error path. You decide what the numbers should be, and you own the mutation round. Generating the cases is cheap. Deciding they are the right cases is the work.
