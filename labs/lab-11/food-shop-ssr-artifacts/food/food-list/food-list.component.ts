import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../food.service';
import { ShopItemComponent } from '../shop-item/shop-item.component';
import { FoodCartItem } from '../shop-item/food-cart-item.model';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [CommonModule, ShopItemComponent],
  providers: [FoodService],
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent {
  fs = inject(FoodService);
  food = this.fs.getFood();
  cart: FoodCartItem[] = []

  updateCart(cartItem: FoodCartItem) {

    console.log("updateCart: ", cartItem);
  }
}
