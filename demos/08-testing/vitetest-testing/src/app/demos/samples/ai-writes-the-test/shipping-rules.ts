export type Zone = 'domestic' | 'eu' | 'world';

export interface Order {
  zone: Zone;
  weightKg: number;
  subtotal: number;
  express: boolean;
}

export const baseRates: Record<Zone, number> = {
  domestic: 4.9,
  eu: 9.9,
  world: 19.9,
};

export const HEAVY_FROM_KG = 5;
export const HEAVY_FLAT = 5;
export const PER_HEAVY_KG = 1.1;
export const FREE_FROM_SUBTOTAL = 100;

export function shippingCost(order: Order): number {
  if (order.weightKg <= 0) {
    throw new Error('Weight must be positive');
  }

  const base = baseRates[order.zone];
  if (base === undefined) {
    throw new Error('Unknown zone');
  }

  if (order.zone === 'domestic' && order.subtotal >= FREE_FROM_SUBTOTAL && !order.express) {
    return 0;
  }

  const heavy =
    order.weightKg > HEAVY_FROM_KG ? HEAVY_FLAT + (order.weightKg - HEAVY_FROM_KG) * PER_HEAVY_KG : 0;
  const cost = base * (order.express ? 2 : 1) + heavy;

  return Math.round(cost * 100) / 100;
}
