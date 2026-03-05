import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FoodItem } from './food.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  http = inject(HttpClient);

  getFood() {
    return this.http.get<FoodItem[]>(`${environment.api}food`);
  }

  getFoodById(id: number) {
    return this.http.get<FoodItem>(`${environment.api}food/${id}`);
  }
}
