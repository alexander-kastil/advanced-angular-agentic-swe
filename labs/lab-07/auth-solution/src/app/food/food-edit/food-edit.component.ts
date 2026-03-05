import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FoodItem } from '../food.model';
import { ColumnDirective } from '../../shared/formatting/formatting-directives';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-food-edit',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    ColumnDirective
  ],
  templateUrl: './food-edit.component.html',
  styleUrl: './food-edit.component.scss'
})
export class FoodEditComponent {
  fb = inject(FormBuilder)
  @Input({ required: true }) food: FoodItem | null = null;
  @Output() onFoodSaved: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();

  foodForm: FormGroup = this.fb.group({
    id: [this.food?.id],
    name: [this.food?.name, [Validators.required, Validators.minLength(3)]],
    price: [this.food?.price, [Validators.required, Validators.min(1)]],
    calories: this.food?.calories,
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['food']) {
      this.foodForm.setValue(changes['food'].currentValue);
    }
  }

  saveForm(): void {
    this.onFoodSaved.emit(this.foodForm.value);
  }
}
