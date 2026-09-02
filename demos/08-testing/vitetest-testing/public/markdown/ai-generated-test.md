# AI Writes the Test

The agent is good at the part of testing that is bookkeeping: enumerating branches, boundary values and error paths. It is not good at deciding what the code is supposed to do. Split the work along that line.

## The unit under test

`discount-calculator.ts` has three tiers, a bulk bonus above a threshold, a rounding rule, and two thrown errors. Small enough to read, big enough to have a real branch table.

```typescript
static rateFor(tier: Tier, amount: number): number {
  if (amount < 0) throw new Error("Amount must not be negative");
  const base = DiscountCalculator.rates[tier];
  if (base === undefined) throw new Error("Unknown tier");
  return amount >= 1000 ? base + 0.05 : base;
}
```

## The prompt

Name the file, name the runner, and name the coverage you want. Do not ask for "tests".

```text
Read discount-calculator.ts.
Write a Vitest spec for it. No TestBed, it is a plain class.
Cover every tier, both sides of the 1000 bulk threshold,
the rounding rule, and both thrown errors.
Assert values, never snapshots.
```

Three things make this prompt work:

- **A named file**, so the agent reads the implementation instead of guessing an API
- **A named runner and style**, so it does not reach for `TestBed` or Jasmine
- **A named branch list**, so the boundary at 1000 is not skipped

## The output

`discount-calculator.spec.ts` is what came back. It asserts 999 and 1000 separately, checks that rounding lands on `31.66` rather than `31.6635`, and matches both error messages by text.

## Review it before you trust it

A generated spec that passes proves nothing on its own. Four checks:

1. **Break the code on purpose.** Change `>= 1000` to `> 1000` and confirm a test goes red. A spec no mutation can break is decoration.
2. **Check the boundaries.** Off-by-one at the threshold is the defect this class is most likely to have, and the one an agent skips most often.
3. **Watch for tests that re-state the implementation.** `expect(rates[tier]).toBe(rates[tier])` passes forever and tests nothing.
4. **Read the error assertions.** `toThrow()` with no argument passes on the wrong error.

## Where it pays

Generate the table of cases, then write the interesting assertion yourself. The agent is fastest at breadth: every tier, every branch, every argument shape. You stay responsible for what the numbers should be.
