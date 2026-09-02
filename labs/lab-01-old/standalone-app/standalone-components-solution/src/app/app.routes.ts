import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { FoodComponent } from './food/food/food.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "food", component: FoodComponent },
    { path: "about", component: AboutComponent }
];
