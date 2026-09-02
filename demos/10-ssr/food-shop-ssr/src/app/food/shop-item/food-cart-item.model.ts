import { FoodItem } from '../food.model';

export interface FoodCartItem extends FoodItem {
  quantity: number;
}
