import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { firstListGuard } from './pages/first-list.guard';
import { listsResolver } from './pages/lists.resolver';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'secrets' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'secrets',
    canActivate: [authGuard, firstListGuard],
    loadComponent: () => import('./pages/secrets-page').then((m) => m.SecretsPage),
  },
  {
    path: 'secrets/:listId',
    canActivate: [authGuard],
    resolve: { lists: listsResolver },
    loadComponent: () => import('./pages/secrets-page').then((m) => m.SecretsPage),
  },
  {
    path: 'secrets/:listId/:secretId',
    canActivate: [authGuard],
    resolve: { lists: listsResolver },
    loadComponent: () => import('./pages/secrets-page').then((m) => m.SecretsPage),
  },
  { path: '**', redirectTo: 'secrets' },
];
