import { RouterModule, Routes } from '@angular/router';
import { FoodContainerComponent } from './food-container/food-container.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: "", component: FoodContainerComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FoodRoutingModule { }
