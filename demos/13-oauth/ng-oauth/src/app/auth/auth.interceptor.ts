import { HttpInterceptorFn } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { AuthStore } from './auth.store';

export const PROTECTED_APIS = new InjectionToken<string[]>('PROTECTED_APIS', {
  factory: () => ['https://api.ng-oauth.demo/']
});

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStore);
  const protectedApis = inject(PROTECTED_APIS);
  const token = auth.token();
  const isProtected = protectedApis.some((api) => req.url.startsWith(api));

  if (!token || !auth.isAuthenticated() || !isProtected) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
