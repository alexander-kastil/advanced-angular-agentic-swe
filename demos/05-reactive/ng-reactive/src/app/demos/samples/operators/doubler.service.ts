import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DoublerService {
  double(nr: number): Observable<number> {
    const del = Math.floor(Math.random() * Math.floor(2500));
    console.log('delaying for: ', del);
    return of(nr * 2).pipe(delay(del));
  }
}
