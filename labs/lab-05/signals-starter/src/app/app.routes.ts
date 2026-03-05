import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { FoodContainerComponent } from './food/food-container/food-container.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "food", component: FoodContainerComponent },
    { path: "about", component: AboutComponent }
];
