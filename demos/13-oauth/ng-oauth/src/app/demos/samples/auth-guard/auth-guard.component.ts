import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../auth/auth.store';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-auth-guard',
  templateUrl: './auth-guard.component.html',
  styleUrl: './auth-guard.component.scss',
  imports: [CodeBlockComponent, RouterLink]
})
export class AuthGuardComponent {
  readonly auth = inject(AuthStore);

  readonly guardSnippet = `export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  const attempted = router.currentNavigation()?.extractedUrl.toString() ?? '/';
  auth.rememberReturnUrl(attempted);
  return router.createUrlTree(['/demos/app-auth-flow']);
};`;

  readonly routeSnippet = `{
  path: 'protected-area',
  canMatch: [authGuard],
  loadComponent: () =>
    import('./samples/auth-guard/protected-area/protected-area.component')
      .then((m) => m.ProtectedAreaComponent)
}`;
}
