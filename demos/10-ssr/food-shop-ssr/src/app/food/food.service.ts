import { Injectable } from '@angular/core';
import { FoodItem } from './food.model';
import { FALLBACK_FOOD } from './food.data';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FoodService {
  async getCatalog(): Promise<FoodItem[]> {
    try {
      const response = await fetch(`${environment.api}food`);
      if (!response.ok) {
        return FALLBACK_FOOD;
      }
      return (await response.json()) as FoodItem[];
    } catch {
      return FALLBACK_FOOD;
    }
  }
}
