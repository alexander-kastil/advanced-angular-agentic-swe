import { describe, it, expect } from 'vitest';
import { Order, Zone, shippingCost } from './shipping-rules';

function order(overrides: Partial<Order> = {}): Order {
  return { zone: 'domestic', weightKg: 1, subtotal: 10, express: false, ...overrides };
}

describe('AI Writes the Test - shippingCost', () => {
  it('charges 4.90 for a light domestic order', () => {
    expect(shippingCost(order())).toBe(4.9);
  });

  it('charges 9.90 for the EU zone', () => {
    expect(shippingCost(order({ zone: 'eu' }))).toBe(9.9);
  });

  it('charges 19.90 for the world zone', () => {
    expect(shippingCost(order({ zone: 'world' }))).toBe(19.9);
  });

  it('doubles the base rate for express', () => {
    expect(shippingCost(order({ zone: 'eu', express: true }))).toBe(19.8);
  });

  it('does not double the heavy surcharge for express', () => {
    expect(shippingCost(order({ zone: 'eu', express: true, weightKg: 6 }))).toBe(25.9);
  });

  it('ships domestic orders free from a subtotal of exactly 100', () => {
    expect(shippingCost(order({ subtotal: 100 }))).toBe(0);
  });

  it('still charges at a subtotal of 99.99', () => {
    expect(shippingCost(order({ subtotal: 99.99 }))).toBe(4.9);
  });

  it('never ships express free', () => {
    expect(shippingCost(order({ subtotal: 250, express: true }))).toBe(9.8);
  });

  it('offers free shipping in the domestic zone only', () => {
    expect(shippingCost(order({ zone: 'eu', subtotal: 250 }))).toBe(9.9);
  });

  it('treats exactly 5 kg as light', () => {
    expect(shippingCost(order({ weightKg: 5 }))).toBe(4.9);
  });

  it('adds the flat surcharge plus 1.10 per kilogram above 5 kg', () => {
    expect(shippingCost(order({ weightKg: 7 }))).toBe(12.1);
  });

  it('rounds the quote to two decimals', () => {
    expect(shippingCost(order({ weightKg: 6.4 }))).toBe(11.44);
  });

  it('throws when the weight is zero', () => {
    expect(() => shippingCost(order({ weightKg: 0 }))).toThrowError('Weight must be positive');
  });

  it('throws when the weight is negative', () => {
    expect(() => shippingCost(order({ weightKg: -2 }))).toThrowError('Weight must be positive');
  });

  it('throws for an unknown zone', () => {
    expect(() => shippingCost(order({ zone: 'moon' as Zone }))).toThrowError('Unknown zone');
  });
});
