import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, CanMatchFn } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { AuthFacade } from '../../../mock-auth/state/auth.facade';

/**
 * canMatch vs  canActivate:
 * - canMatch: Prevents lazy loading completely if guard fails
 * - canActivate: Loads module but prevents navigation
 * 
 * Use canMatch for role-based feature access to avoid downloading unnecessary code
 */
export const featureAccessGuard: CanMatchFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  // In real app, check user role/permissions here
  const hasAccess = Math.random() > 0.5; // Simulate random access

  if (!hasAccess) {
    console.log('Access denied - module will not be loaded');
    router.navigate(['/auth/sign-in']);
    return false;
  }

  console.log('Access granted - module can be loaded');
  return true;
};

@Component({
  selector: 'app-can-match-guard',
  templateUrl: './can-match-guard.component.html',
  styleUrls: ['./can-match-guard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatButton
  ]
})
export class CanMatchGuardComponent {
  protected router = inject(Router);
  protected authFacade = inject(AuthFacade);
  protected isAuthenticated = toSignal(this.authFacade.isAuthenticated());

  protected tryNavigation() {
    // This would navigate to a route protected by canMatch
    console.log('Attempting navigation to protected route...');
  }
}
