import { Component, EventEmitter, Input, Output, SimpleChanges, WritableSignal } from '@angular/core';
import { FoodItem } from '../food.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ClickableDirective } from '../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-food-list',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, ClickableDirective],
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.scss'
})
export class FoodListComponent {
  @Input({ required: true }) food !: FoodItem[];
  @Output() onFoodSelected: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();
  @Output() onFoodDeleted: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();

  displayedColumns: string[] = ['id', 'name', 'price', 'calories', 'delete', 'select'];
  dataSource: MatTableDataSource<FoodItem> = new MatTableDataSource<FoodItem>([]);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['food']) {
      this.dataSource = new MatTableDataSource(changes['food'].currentValue);
    }
  }

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
