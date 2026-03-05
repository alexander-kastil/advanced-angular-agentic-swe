import { Component, effect, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClickableDirective } from '../../shared/formatting/formatting-directives';
import { FoodItem } from '../food.model';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, ClickableDirective],
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.scss'
})
export class FoodListComponent {
  food = input.required<FoodItem[]>();
  onFoodSelected = output<FoodItem>();
  onFoodDeleted = output<FoodItem>();

  displayedColumns: string[] = ['id', 'name', 'price', 'calories', 'delete', 'select'];
  dataSource: MatTableDataSource<FoodItem> = new MatTableDataSource<FoodItem>([]);

  initMatTableSource = effect(() => {
    this.dataSource = new MatTableDataSource(this.food());
  });

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectFood(food: FoodItem) {
    this.onFoodSelected.emit(food);
  }

  deleteFood(food: FoodItem) {
    this.onFoodDeleted.emit(food);
  }
}
