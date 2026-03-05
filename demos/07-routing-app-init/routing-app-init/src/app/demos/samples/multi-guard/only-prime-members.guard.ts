import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { AuthFacade } from 'src/app/mock-auth/state/auth.facade';

export const onlyPrimeMembersGuard = () => {
  const auth = inject(AuthFacade);
  const sns = inject(SnackbarService);
  return auth.hasPrimeSubscription().pipe(
    tap((hasSubscription) => {
      if (!hasSubscription) {
        sns.displayAlert('No Access', 'Access only for prime members');
      }
    })
  );
}
