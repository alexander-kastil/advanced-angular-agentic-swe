import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, throwError } from 'rxjs';
import { PROTECTED_APIS } from './auth.interceptor';

export interface EchoBody {
  method: string;
  url: string;
  headers: Record<string, string>;
}

export const echoBackendInterceptor: HttpInterceptorFn = (req) => {
  const protectedApis = inject(PROTECTED_APIS);
  const headers = Object.fromEntries(
    req.headers.keys().map((key) => [key, req.headers.get(key) ?? ''])
  );
  const body: EchoBody = { method: req.method, url: req.url, headers };
  const isProtected = protectedApis.some((api) => req.url.startsWith(api));

  if (isProtected && !req.headers.has('Authorization')) {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          url: req.url,
          headers: new HttpHeaders({ 'WWW-Authenticate': 'Bearer' }),
          error: body
        })
    );
  }

  return of(
    new HttpResponse({
      status: 200,
      statusText: 'OK',
      url: req.url,
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-Echo': 'ng-oauth' }),
      body
    })
  );
};
