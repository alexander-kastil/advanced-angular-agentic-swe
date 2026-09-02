import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FoodItem } from 'src/app/food/food.model';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-food-list',
    templateUrl: './food-list.component.html',
    styleUrls: ['./food-list.component.scss'],
    standalone: true,
    imports: [MatCardModule, MatTableModule],
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
