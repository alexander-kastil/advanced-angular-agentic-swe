import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FoodItem } from 'src/app/food/food.model';
import { FoodEditComponent } from '../food-edit/food-edit.component';
import { FoodListComponent } from '../food-list/food-list.component';
import { FoodEntityService } from '../state/food-entity.service';

@Component({
  selector: 'app-food-container',
  templateUrl: './food-container.component.html',
  styleUrls: ['./food-container.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatToolbarModule,
    MatButtonModule,
    FoodListComponent,
    FoodEditComponent
  ],
})
export class FoodContainerComponent implements OnInit {
  fs = inject(FoodEntityService);
  food = this.fs.entities$;
  selected: FoodItem | undefined = undefined;

  ngOnInit(): void {
    this.fs.loaded$.subscribe((loaded) => {
      if (!loaded) {
        this.fs.getAll();
      }
    })
  }

  selectFood(f: FoodItem) {
    this.selected = { ...f };
  }

  addFood() {
    this.selected = new FoodItem();
  }

  saveFood(f: FoodItem) {
    f.id == 0 ? this.fs.add(f) : this.fs.update(f);
  }
}
