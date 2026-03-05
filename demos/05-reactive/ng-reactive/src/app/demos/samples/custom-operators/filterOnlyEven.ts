import { Observable } from 'rxjs';

export function filterOnlyEven(source: Observable<number>): Observable<number> {
  return new Observable((observer) => {
    source.subscribe({
      next: (val: number) => {
        if (val % 2 === 0) {
          observer.next(val);
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    });
  });
}
