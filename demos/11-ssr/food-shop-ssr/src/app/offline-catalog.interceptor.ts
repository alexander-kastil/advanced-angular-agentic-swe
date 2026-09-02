import { HttpHeaders, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import { FALLBACK_FOOD } from './food/food.data';
import { FALLBACK_DEMOS } from './demos/demo-container/demo.data';

export const OFFLINE_CATALOG_HEADER = 'x-offline-catalog';

const offlineBody = (url: string): unknown => {
  const dish = /food\/(\d+)$/.exec(url);
  if (dish) {
    return FALLBACK_FOOD.find((item) => item.id === Number(dish[1])) ?? null;
  }
  if (/\/food$/.test(url)) {
    return FALLBACK_FOOD;
  }
  if (/\/demos$/.test(url)) {
    return FALLBACK_DEMOS;
  }
  return undefined;
};

export const offlineCatalogInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error) => {
      const body = offlineBody(req.url);
      if (body === undefined) {
        return throwError(() => error);
      }

      return of(
        new HttpResponse({
          status: 200,
          url: req.url,
          headers: new HttpHeaders({ [OFFLINE_CATALOG_HEADER]: 'true' }),
          body,
        })
      );
    })
  );
