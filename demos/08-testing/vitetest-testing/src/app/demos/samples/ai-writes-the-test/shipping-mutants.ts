import { QuoteFn } from './shipping-contract';
import { FREE_FROM_SUBTOTAL, HEAVY_FLAT, HEAVY_FROM_KG, Order, PER_HEAVY_KG, baseRates } from './shipping-rules';

export interface Mutant {
  name: string;
  change: string;
  quote: QuoteFn;
}

function heavyFor(weightKg: number, from: number): number {
  return weightKg > from ? HEAVY_FLAT + (weightKg - from) * PER_HEAVY_KG : 0;
}

export const mutants: Mutant[] = [
  {
    name: 'heavy boundary',
    change: 'weightKg > 5 becomes weightKg >= 5',
    quote: (order: Order) => {
      if (order.weightKg <= 0) throw new Error('Weight must be positive');
      const base = baseRates[order.zone];
      if (base === undefined) throw new Error('Unknown zone');
      if (order.zone === 'domestic' && order.subtotal >= FREE_FROM_SUBTOTAL && !order.express) return 0;
      const heavy =
        order.weightKg >= HEAVY_FROM_KG ? HEAVY_FLAT + (order.weightKg - HEAVY_FROM_KG) * PER_HEAVY_KG : 0;
      return Math.round((base * (order.express ? 2 : 1) + heavy) * 100) / 100;
    },
  },
  {
    name: 'express doubles everything',
    change: 'the surcharge is doubled along with the base rate',
    quote: (order: Order) => {
      if (order.weightKg <= 0) throw new Error('Weight must be positive');
      const base = baseRates[order.zone];
      if (base === undefined) throw new Error('Unknown zone');
      if (order.zone === 'domestic' && order.subtotal >= FREE_FROM_SUBTOTAL && !order.express) return 0;
      const heavy = heavyFor(order.weightKg, HEAVY_FROM_KG);
      return Math.round((base + heavy) * (order.express ? 2 : 1) * 100) / 100;
    },
  },
  {
    name: 'free express shipping',
    change: 'the free-shipping rule stops excluding express',
    quote: (order: Order) => {
      if (order.weightKg <= 0) throw new Error('Weight must be positive');
      const base = baseRates[order.zone];
      if (base === undefined) throw new Error('Unknown zone');
      if (order.zone === 'domestic' && order.subtotal >= FREE_FROM_SUBTOTAL) return 0;
      const heavy = heavyFor(order.weightKg, HEAVY_FROM_KG);
      return Math.round((base * (order.express ? 2 : 1) + heavy) * 100) / 100;
    },
  },
  {
    name: 'free-shipping threshold',
    change: 'subtotal >= 100 becomes subtotal > 100',
    quote: (order: Order) => {
      if (order.weightKg <= 0) throw new Error('Weight must be positive');
      const base = baseRates[order.zone];
      if (base === undefined) throw new Error('Unknown zone');
      if (order.zone === 'domestic' && order.subtotal > FREE_FROM_SUBTOTAL && !order.express) return 0;
      const heavy = heavyFor(order.weightKg, HEAVY_FROM_KG);
      return Math.round((base * (order.express ? 2 : 1) + heavy) * 100) / 100;
    },
  },
  {
    name: 'free shipping everywhere',
    change: 'the zone check drops out of the free-shipping rule',
    quote: (order: Order) => {
      if (order.weightKg <= 0) throw new Error('Weight must be positive');
      const base = baseRates[order.zone];
      if (base === undefined) throw new Error('Unknown zone');
      if (order.subtotal >= FREE_FROM_SUBTOTAL && !order.express) return 0;
      const heavy = heavyFor(order.weightKg, HEAVY_FROM_KG);
      return Math.round((base * (order.express ? 2 : 1) + heavy) * 100) / 100;
    },
  },
  {
    name: 'no rounding',
    change: 'the result is returned unrounded',
    quote: (order: Order) => {
      if (order.weightKg <= 0) throw new Error('Weight must be positive');
      const base = baseRates[order.zone];
      if (base === undefined) throw new Error('Unknown zone');
      if (order.zone === 'domestic' && order.subtotal >= FREE_FROM_SUBTOTAL && !order.express) return 0;
      const heavy = heavyFor(order.weightKg, HEAVY_FROM_KG);
      return base * (order.express ? 2 : 1) + heavy;
    },
  },
  {
    name: 'silent unknown zone',
    change: 'an unknown zone returns 0 instead of throwing',
    quote: (order: Order) => {
      if (order.weightKg <= 0) throw new Error('Weight must be positive');
      const base = baseRates[order.zone];
      if (base === undefined) return 0;
      if (order.zone === 'domestic' && order.subtotal >= FREE_FROM_SUBTOTAL && !order.express) return 0;
      const heavy = heavyFor(order.weightKg, HEAVY_FROM_KG);
      return Math.round((base * (order.express ? 2 : 1) + heavy) * 100) / 100;
    },
  },
  {
    name: 'weight guard off by one',
    change: 'weightKg <= 0 becomes weightKg < 0',
    quote: (order: Order) => {
      if (order.weightKg < 0) throw new Error('Weight must be positive');
      const base = baseRates[order.zone];
      if (base === undefined) throw new Error('Unknown zone');
      if (order.zone === 'domestic' && order.subtotal >= FREE_FROM_SUBTOTAL && !order.express) return 0;
      const heavy = heavyFor(order.weightKg, HEAVY_FROM_KG);
      return Math.round((base * (order.express ? 2 : 1) + heavy) * 100) / 100;
    },
  },
];
