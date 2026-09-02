import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthFacade } from '../mock-auth/auth.facade';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFacade);
  const token = auth.token();
  const isLocalApi = req.url.includes(environment.api);

  if (!auth.isAuthenticated() || !token || isLocalApi) {
    return next(req);
  }

  return next(
    req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    })
  );
};
