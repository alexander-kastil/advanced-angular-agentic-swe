import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.log('handling http error', error);
      throw new Error(error.message);
    })
  );
};
