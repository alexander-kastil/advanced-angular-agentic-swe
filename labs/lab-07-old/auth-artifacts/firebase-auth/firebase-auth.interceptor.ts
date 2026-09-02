import { Observable } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { FirebaseAuthService } from './firebase-auth.service';
import { Inject, forwardRef, Injectable } from '@angular/core';

@Injectable()
export class FirebaseAuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(forwardRef(() => FirebaseAuthService)) as: FirebaseAuthService
  ) {
    as.getToken().subscribe((t) => {
      this.token = t;
    });
  }

  token: string = '';

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.token != '') {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${this.token}` },
      });
      console.log('Interceptor added Bearer Token for request', cloned);
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
