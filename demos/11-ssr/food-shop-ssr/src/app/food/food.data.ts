import { FoodItem } from './food.model';

export const FALLBACK_FOOD: FoodItem[] = [
  {
    id: 1,
    name: 'Butter Chicken',
    price: 12,
    inStock: 9,
    code: 'btc',
    pictureUrl: 'assets/images/falaffel.jpg',
    description:
      'Butter Chicken is a dish of chicken in a spiced curry sauce. It is a dish of the Indian subcontinent originating in the Punjab region.',
  },
  {
    id: 2,
    name: 'Blini with Salmon',
    price: 9,
    inStock: 12,
    code: 'bls',
    pictureUrl: 'assets/images/falaffel.jpg',
    description:
      'Blinis are mini pancakes that make perfect finger food. Top with dill creme fraiche and smoked salmon for a timeless, elegant canape.',
  },
  {
    id: 3,
    name: 'Wiener Schnitzel',
    price: 18,
    inStock: 23,
    code: 'ws',
    pictureUrl: 'assets/images/falaffel.jpg',
    description:
      'Wiener Schnitzel is a veal cutlet pounded thin, breaded and pan-fried. A traditional Austrian dish served with a lemon wedge.',
  },
];
