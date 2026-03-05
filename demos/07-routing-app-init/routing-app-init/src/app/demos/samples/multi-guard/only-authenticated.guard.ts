import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { AuthFacade } from 'src/app/mock-auth/state/auth.facade';

export const onlyAuthenticatedGuard = () => {
  const auth = inject(AuthFacade);
  const sns = inject(SnackbarService);
  return auth.isAuthenticated().pipe(
    tap((authenticated) => {
      if (!authenticated) {
        sns.displayAlert('No Access', 'Access only for authenticated users');
      }
    })
  );
}; 