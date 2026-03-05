import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { RetryConfig, retry } from 'rxjs/operators';

export const retryInterceptor = (config: RetryConfig) => {
  const interceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return next(req).pipe(retry(config));
  };
  return interceptor;
};