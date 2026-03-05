import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthFacade } from '../mock-auth/state/auth.facade';

// json-server is not configured to handle authentication. To avoid errors we add: 
// req.url.includes(environment.api) == false
export const authInterceptor: HttpInterceptorFn = (req, next,) => {
  const auth = inject(AuthFacade);
  if (auth.isAuthenticated() && req.url.includes(environment.api) == false) {
    const token = auth.getToken();
    console.log('adding token to header:', token)
    const modifiedRequest = req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer ' + token
      ),
    });
    return next(modifiedRequest);
  } else {
    console.log('Http-Error', 'You must be logged in to ...');
  }
  return next(req);
};
