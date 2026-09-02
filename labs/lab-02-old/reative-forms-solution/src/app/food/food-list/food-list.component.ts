import {
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FoodItem } from '../food.model';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss'],
  imports: [MatCardModule, MatTableModule]
})
export class FoodListComponent implements OnChanges {
  readonly food = input<FoodItem[] | null>([]);
  readonly onFoodSelected = output<FoodItem>();

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
