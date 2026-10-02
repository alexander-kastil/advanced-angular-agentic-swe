import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './loading.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { tap, catchError, finalize, throwError } from 'rxjs';

const requests: HttpRequest<unknown>[] = [];

function removeRequest(req: HttpRequest<unknown>, ls: LoadingService) {
  const i = requests.indexOf(req);
  if (i >= 0) {
    requests.splice(i, 1);
  }
  ls.setLoading(requests.length > 0);
}

export function loadingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const ls = inject(LoadingService);
  const sbs = inject(SnackbarService);

  requests.push(req);
  ls.setLoading(true);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        removeRequest(req, ls);
      }
    }),
    catchError((err) => {
      sbs.displayAlert('error', 'open console for details');
      removeRequest(req, ls);
      return throwError(() => err);
    }),
    finalize(() => {
      removeRequest(req, ls);
    })
  );
}
