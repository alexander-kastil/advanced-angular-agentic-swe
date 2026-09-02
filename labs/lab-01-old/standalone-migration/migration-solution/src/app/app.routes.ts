import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'demos',
        loadChildren: () =>
            import('./demos/demos.module').then((m) => m.DemosModule),
    }
];