import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';
import { authInterceptor } from '../auth/auth.interceptor';
import { echoBackendInterceptor } from '../auth/echo-backend.interceptor';
import { DemoContainerComponent } from './demo-container/demo-container.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      {
        path: 'oauth-oidc',
        loadComponent: () =>
          import('./samples/oauth-oidc/oauth-oidc.component').then((m) => m.OauthOidcComponent)
      },
      {
        path: 'jwt-anatomy',
        loadComponent: () =>
          import('./samples/jwt-anatomy/jwt-anatomy.component').then((m) => m.JwtAnatomyComponent)
      },
      {
        path: 'bearer-requests',
        providers: [provideHttpClient(withInterceptors([echoBackendInterceptor]))],
        loadComponent: () =>
          import('./samples/bearer-requests/bearer-requests.component').then(
            (m) => m.BearerRequestsComponent
          )
      },
      {
        path: 'auth-interceptor',
        providers: [provideHttpClient(withInterceptors([authInterceptor, echoBackendInterceptor]))],
        loadComponent: () =>
          import('./samples/auth-interceptor/auth-interceptor.component').then(
            (m) => m.AuthInterceptorComponent
          )
      },
      {
        path: 'auth-store',
        loadComponent: () =>
          import('./samples/auth-store/auth-store.component').then((m) => m.AuthStoreComponent)
      },
      {
        path: 'auth-guard',
        loadComponent: () =>
          import('./samples/auth-guard/auth-guard.component').then((m) => m.AuthGuardComponent)
      },
      {
        path: 'protected-area',
        canMatch: [authGuard],
        loadComponent: () =>
          import('./samples/auth-guard/protected-area/protected-area.component').then(
            (m) => m.ProtectedAreaComponent
          )
      },
      {
        path: 'app-auth-flow',
        loadComponent: () =>
          import('./samples/app-auth-flow/app-auth-flow.component').then(
            (m) => m.AppAuthFlowComponent
          )
      },
      {
        path: 'firebase-auth',
        loadComponent: () =>
          import('./samples/firebase-auth/firebase-auth.component').then(
            (m) => m.FirebaseAuthComponent
          )
      },
      {
        path: 'entra-msal',
        loadComponent: () =>
          import('./samples/entra-msal/entra-msal.component').then((m) => m.EntraMsalComponent)
      },
      {
        path: 'msal-vs-easy-auth',
        loadComponent: () =>
          import('./samples/msal-vs-easy-auth/msal-vs-easy-auth.component').then(
            (m) => m.MsalVsEasyAuthComponent
          )
      }
    ]
  }
];
