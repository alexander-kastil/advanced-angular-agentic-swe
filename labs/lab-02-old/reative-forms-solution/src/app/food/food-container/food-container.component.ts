import { Component, OnInit, inject } from '@angular/core';
import { FoodService } from '../food.service';
import { FoodEditComponent } from '../food-edit/food-edit.component';

import { FoodListComponent } from '../food-list/food-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FoodItem } from '../food.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-food-container',
  templateUrl: './food-container.component.html',
  styleUrls: ['./food-container.component.scss'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    FoodListComponent,
    FoodEditComponent
  ]
})
export class FoodContainerComponent {
  fs = inject(FoodService);
  food = toSignal(this.fs.getFood(), { initialValue: [] });
  selected: FoodItem | undefined = undefined;

  selectFood(f: FoodItem) {
    this.selected = { ...f };
  }

  addFood() {
    this.selected = new FoodItem();
  }

  saveFood(f: FoodItem) {
    if (f.id === 0) {
      this.fs.addFood(f).subscribe(() => {
        this.selected = undefined;
      });
    } else {
      this.fs.updateFood(f).subscribe(() => {
        this.selected = undefined;
      });
    }
  }
}
