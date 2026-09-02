import { Component, input, linkedSignal, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EuroPipe } from '../../shared/euro.pipe';
import { NumberPickerComponent } from '../../shared/number-picker/number-picker.component';
import { FoodItem } from '../food.model';
import { FoodCartItem } from './food-cart-item.model';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss',
  imports: [RouterLink, NgOptimizedImage, EuroPipe, NumberPickerComponent],
})
export class ShopItemComponent {
  readonly food = input.required<FoodItem>();
  readonly inCart = input<number>(0);
  readonly itemChanged = output<FoodCartItem>();

  readonly quantity = linkedSignal(() => this.inCart());

  handleAmountChange(amount: number) {
    this.quantity.set(amount);
    this.itemChanged.emit({ ...this.food(), quantity: amount });
  }
}
