import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EuroPipe } from '../../shared/euro.pipe';
import { NumberPickerComponent } from '../../shared/number-picker/number-picker.component';
import { FoodItem } from '../food.model';
import { FoodCartItem } from './food-cart-item.model';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss',
  imports: [MatCardModule, RouterModule, MatIconModule, NgOptimizedImage, EuroPipe, NumberPickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopItemComponent {
  readonly food = input.required<FoodItem>();
  readonly inCart = input<number>(0);
  readonly itemChanged = output<FoodCartItem>();

  readonly quantity = signal<number>(0);

  constructor() {
    effect(() => {
      this.quantity.set(this.inCart());
    });
  }

  handleAmountChange(amount: number) {
    this.quantity.set(amount);
    const item: FoodCartItem = { ...this.food(), quantity: amount };
    this.itemChanged.emit(item);
  }
}
