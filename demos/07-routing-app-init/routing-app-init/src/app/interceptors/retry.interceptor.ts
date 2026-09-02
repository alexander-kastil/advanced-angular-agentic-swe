import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { RetryConfig, retry } from 'rxjs/operators';

export const retryInterceptor = (config: RetryConfig): HttpInterceptorFn => {
  return (req: HttpRequest<unknown>, next: HttpHandlerFn) =>
    next(req).pipe(retry(config));
};
