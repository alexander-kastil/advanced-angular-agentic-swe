import { Routes } from '@angular/router';
import { FoodDetailsComponent } from './food/food-details/food-details.component';
import { FoodListComponent } from './food/food-list/food-list.component';

export const foodRoutes: Routes = [
    {
        path: '',
        component: FoodListComponent,
    },
    {
        path: 'food/:id',
        component: FoodDetailsComponent,
    }
];
