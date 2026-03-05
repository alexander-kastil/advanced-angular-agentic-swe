import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FoodItem } from 'src/app/food/food.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
})
export class FoodListComponent implements OnChanges {
  @Input() food: FoodItem[] | null = [];
  @Output() onFoodSelected: EventEmitter<FoodItem> = new EventEmitter<FoodItem>();

  displayedColumns: string[] = ['id', 'name', 'price', 'calories'];
  dataSource: MatTableDataSource<FoodItem> = new MatTableDataSource<FoodItem>([]);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['food']) {
      console.log('ngOnChanges', changes['food'].currentValue);
      this.dataSource = new MatTableDataSource(changes['food'].currentValue);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectFood(p: FoodItem) {
    this.onFoodSelected.emit(p);
  }
}
