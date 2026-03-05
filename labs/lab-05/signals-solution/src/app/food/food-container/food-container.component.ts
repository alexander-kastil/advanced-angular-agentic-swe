import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FoodEditComponent } from '../food-edit/food-edit.component';
import { FoodListComponent } from '../food-list/food-list.component';
import { FoodItem } from '../food.model';
import { foodStore } from '../store/food.store';

@Component({
  selector: 'app-food-container',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatProgressBarModule, FoodEditComponent, FoodListComponent],
  templateUrl: './food-container.component.html',
  styleUrl: './food-container.component.scss'
})
export class FoodContainerComponent {
  store = inject(foodStore)

  selectFood(item: FoodItem) {
    this.store.selectFood(item.id);
  }

  saveFood(item: FoodItem) {
    if (item.id != 0) {
      this.store.updateFood(item);
    } else {
      item.id = this.store.nextId();
      this.store.addFood(item);
    }
    this.store.clearSelected();
  }

  addFood() {
    this.store.addNew();
  }

  deleteFood(item: FoodItem) {
    this.store.removeFood(item.id);
    this.store.clearSelected();
  }
}
