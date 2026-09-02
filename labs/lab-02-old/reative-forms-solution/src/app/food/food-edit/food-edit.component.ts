
import { Component, OnChanges, SimpleChanges, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FoodItem } from '../food.model';

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.scss'],
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class FoodEditComponent {
  fb = inject(FormBuilder);
  readonly food = input<FoodItem>(new FoodItem());
  readonly onFoodSaved = output<FoodItem>();
  foodForm = this.createForm(this.food());

  onFoodChange = effect(() => {
    this.foodForm = this.createForm(this.food());
  });

  private createForm(food: FoodItem) {
    return this.fb.nonNullable.group({
      id: [food.id, [Validators.required]],
      name: [food.name, [Validators.required, Validators.minLength(3)]],
      price: [food.price, [Validators.required, Validators.min(1)]],
      calories: [food.calories],
    });
  }

  saveForm(): void {
    console.log('food to save', this.foodForm.value);
    this.onFoodSaved.emit(this.foodForm.value as FoodItem);
  }
}
