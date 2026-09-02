import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthFacade } from '../../../mock-auth/auth.facade';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

export const onlyAuthenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const sns = inject(SnackbarService);

  if (auth.isAuthenticated()) {
    return true;
  }

  sns.displayAlert('No Access', 'Access only for authenticated users');
  return false;
};
