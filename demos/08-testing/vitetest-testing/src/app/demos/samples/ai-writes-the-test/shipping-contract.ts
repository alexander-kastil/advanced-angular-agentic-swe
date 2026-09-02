import { Order, Zone } from './shipping-rules';

export type QuoteFn = (order: Order) => number;

export interface ContractCase {
  name: string;
  run(quote: QuoteFn): void;
}

export interface ContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

function order(overrides: Partial<Order> = {}): Order {
  return { zone: 'domestic', weightKg: 1, subtotal: 10, express: false, ...overrides };
}

function equals(actual: number, expected: number, what: string): void {
  if (actual !== expected) {
    throw new Error(`${what}: expected ${expected}, got ${actual}`);
  }
}

function throwsWith(fn: () => unknown, message: string): void {
  let thrown: unknown;
  try {
    fn();
  } catch (err) {
    thrown = err;
  }
  if (thrown === undefined) {
    throw new Error(`expected a throw with message "${message}", nothing was thrown`);
  }
  const actual = (thrown as Error).message;
  if (actual !== message) {
    throw new Error(`expected message "${message}", got "${actual}"`);
  }
}

export const shippingContract: ContractCase[] = [
  {
    name: 'charges the base rate per zone',
    run: (quote) => {
      equals(quote(order({ zone: 'domestic' })), 4.9, 'domestic');
      equals(quote(order({ zone: 'eu' })), 9.9, 'eu');
      equals(quote(order({ zone: 'world' })), 19.9, 'world');
    },
  },
  {
    name: 'express doubles the base rate but not the heavy surcharge',
    run: (quote) => {
      equals(quote(order({ zone: 'eu', express: true })), 19.8, 'eu express');
      equals(quote(order({ zone: 'eu', express: true, weightKg: 6 })), 25.9, 'eu express heavy');
    },
  },
  {
    name: 'ships domestic orders free from a subtotal of 100',
    run: (quote) => {
      equals(quote(order({ subtotal: 100 })), 0, 'subtotal 100');
      equals(quote(order({ subtotal: 99.99 })), 4.9, 'subtotal 99.99');
    },
  },
  {
    name: 'never ships express free',
    run: (quote) => {
      equals(quote(order({ subtotal: 250, express: true })), 9.8, 'domestic express');
    },
  },
  {
    name: 'offers free shipping in the domestic zone only',
    run: (quote) => {
      equals(quote(order({ zone: 'eu', subtotal: 250 })), 9.9, 'eu above threshold');
    },
  },
  {
    name: 'adds the heavy surcharge above five kilograms only',
    run: (quote) => {
      equals(quote(order({ weightKg: 5 })), 4.9, 'exactly 5 kg');
      equals(quote(order({ weightKg: 7 })), 12.1, '7 kg');
    },
  },
  {
    name: 'rounds the quote to two decimals',
    run: (quote) => {
      equals(quote(order({ weightKg: 6.4 })), 11.44, '6.4 kg');
    },
  },
  {
    name: 'rejects a weight of zero or less',
    run: (quote) => {
      throwsWith(() => quote(order({ weightKg: 0 })), 'Weight must be positive');
      throwsWith(() => quote(order({ weightKg: -2 })), 'Weight must be positive');
    },
  },
  {
    name: 'rejects an unknown zone',
    run: (quote) => {
      throwsWith(() => quote(order({ zone: 'moon' as Zone })), 'Unknown zone');
    },
  },
];

export function runShippingContract(quote: QuoteFn): ContractResult[] {
  return shippingContract.map((testCase) => {
    try {
      testCase.run(quote);
      return { name: testCase.name, passed: true, detail: 'passed' };
    } catch (err) {
      return { name: testCase.name, passed: false, detail: (err as Error).message };
    }
  });
}
