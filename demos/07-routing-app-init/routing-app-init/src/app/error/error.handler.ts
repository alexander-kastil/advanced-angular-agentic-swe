import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorLogService } from './error-log.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private injector = inject(Injector);

  handleError(error: Error | HttpErrorResponse) {
    const message = error.message ?? String(error);
    console.warn('An error occurred:', error);

    this.injector.get(ErrorLogService).record('ErrorHandler', message);
    this.injector.get(Router).navigate(['/error'], { state: { data: message } });
  }
}
