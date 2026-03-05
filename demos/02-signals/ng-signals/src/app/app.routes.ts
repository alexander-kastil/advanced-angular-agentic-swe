import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'demos',
        loadChildren: () =>
            import('./demos/demo.routes').then((m) => m.demoRoutes),
    },
    {
        path: 'customers',
        loadChildren: () =>
            import('./customers/customer.routes').then((m) => m.customersRoutes),
    },
    {
        path: 'skills',
        loadChildren: () =>
            import('./skills/skills.routes').then((m) => m.skillRoutes),
    },
];