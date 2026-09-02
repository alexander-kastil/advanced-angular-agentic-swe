import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'demos',
    loadChildren: () => import('./demos/demo.routes').then((m) => m.demoRoutes)
  },
  { path: '**', redirectTo: '' }
];
