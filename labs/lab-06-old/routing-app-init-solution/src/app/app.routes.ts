import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './shared/error/error.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "food", data: { preload: false }, loadComponent: () => import('./food/food-container/food-container.component').then(m => m.FoodContainerComponent) },
    { path: "about", component: AboutComponent },
    { path: "error", component: ErrorComponent },
    { path: "login", component: LoginComponent },
    { path: "**", redirectTo: "error" }
];