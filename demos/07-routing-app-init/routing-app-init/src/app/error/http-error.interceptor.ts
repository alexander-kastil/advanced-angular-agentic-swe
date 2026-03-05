import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({ count: 3, delay: 1000 }),
    catchError((error) => {
      console.log('handling http error', error)
      throw new Error(error.message);
    })
  );
};