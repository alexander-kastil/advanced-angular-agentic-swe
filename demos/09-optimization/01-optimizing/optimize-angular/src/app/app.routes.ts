import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: "Demo App Home"
    },
    {
        path: 'demos',
        loadChildren: () =>
            import('./demos/demo.routes').then((m) => m.demoRoutes),
    },
    {
        path: 'skills',
        loadChildren: () =>
            import('./skills/skills.routes').then((m) => m.skillRoutes),
    },
];