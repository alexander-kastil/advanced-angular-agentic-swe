import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthFacade } from '../../../mock-auth/auth.facade';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

export const featureAccessGuard: CanMatchFn = () => {
  const auth = inject(AuthFacade);
  const sns = inject(SnackbarService);

  if (auth.isPrimeMember()) {
    return true;
  }

  sns.displayAlert('No Access', 'The chunk is never downloaded');
  return false;
};
