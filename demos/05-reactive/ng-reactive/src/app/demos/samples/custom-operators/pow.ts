import { Observable } from 'rxjs';

export const pow = (n: number) => (source: Observable<any>) =>
  new Observable(observer => {
    return source.subscribe({
      next(x) {
        observer.next(Math.pow(x, n));
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });
  });
