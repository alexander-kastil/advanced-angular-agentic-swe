import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FoodItem } from '../food.model';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.scss'],
})
export class FoodEditComponent {
  @Input() food = new FoodItem();
  @Output() onFoodSaved: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();

  saveFood() {
    console.log('food to save', this.food);
    this.onFoodSaved.emit(this.food);
  }
}
