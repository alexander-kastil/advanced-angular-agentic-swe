import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorLogService } from './error-log.service';

export function describeHttpError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'The server could not be reached';
  }
  if (error.status === 404) {
    return 'That record no longer exists';
  }
  if (error.status === 409) {
    return 'Someone else changed this record first';
  }
  if (error.status >= 500) {
    return 'The server failed, please retry';
  }
  return `Unexpected error (${error.status})`;
}

export function errorMappingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const log = inject(ErrorLogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = describeHttpError(error);
      log.record({ url: req.urlWithParams, status: error.status, message });
      return throwError(() => new Error(message));
    })
  );
}
