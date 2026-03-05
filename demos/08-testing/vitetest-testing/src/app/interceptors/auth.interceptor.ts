import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { authStore } from '../mock-auth/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next,) => {
  const store = inject(authStore);
  if (store.isAuthenticated() && req.url.includes(environment.api) == false) {
    const token = store.token();
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
