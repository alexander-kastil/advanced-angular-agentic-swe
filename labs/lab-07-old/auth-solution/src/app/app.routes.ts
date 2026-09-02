import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { FoodComponent } from './food/container/food.component';
import { firebaseGuard } from './firebase-auth/firebase.auth-guard.service';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "about", component: AboutComponent },
    {
        path: "food",
        component: FoodComponent,
        canActivate: [firebaseGuard],
    },
];
