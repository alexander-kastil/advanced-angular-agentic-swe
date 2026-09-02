import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';
import { SnackbarService } from './snackbar.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  ls = inject(LoadingService);
  sbs = inject(SnackbarService);
  private requests: HttpRequest<any>[] = [];

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      console.log('removing request from queue: ', req.url);
      this.requests.splice(i, 1);
    }
    this.ls.setLoading(this.requests.length > 0);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(
      'pushing request to queue at index: ' + this.requests.length,
      req.url
    );
    this.requests.push(req);

    this.ls.setLoading(true);
    return Observable.create((observer: any) => {
      const subscription = next.handle(req).subscribe(
        (event) => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        (err) => {
          console.log('Interceptor error', err);
          this.sbs.displayAlert('erro', 'open console for details');
          this.removeRequest(req);
          observer.error(err);
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        }
      );
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
