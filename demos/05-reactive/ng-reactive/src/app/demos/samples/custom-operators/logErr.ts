import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export function logError() {
  return catchError(err => {
    console.log('Error', err);
    return EMPTY;
  });
}

export function getFromApi(http: HttpClient, url: string) {
  return http.get(url).pipe(logError());
}
