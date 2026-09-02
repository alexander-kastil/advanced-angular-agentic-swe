import { describe, it, expect } from 'vitest';
import { runShippingContract, shippingContract } from './shipping-contract';
import { mutants } from './shipping-mutants';
import { shippingCost } from './shipping-rules';

describe('AI Writes the Test - mutation round', () => {
  it('passes every case against the real implementation', () => {
    const failures = runShippingContract(shippingCost).filter((r) => !r.passed);
    expect(failures).toEqual([]);
  });

  it('covers every rule in the behaviour statement', () => {
    expect(shippingContract.length).toBe(9);
  });

  it.each(mutants.map((m) => [m.name, m] as const))('kills the "%s" mutant', (_name, mutant) => {
    const killedBy = runShippingContract(mutant.quote).filter((r) => !r.passed);
    expect(killedBy.length).toBeGreaterThan(0);
  });
});
