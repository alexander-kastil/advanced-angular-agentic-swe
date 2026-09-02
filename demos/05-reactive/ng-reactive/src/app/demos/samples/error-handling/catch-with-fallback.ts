import { MonoTypeOperatorFunction, Observable, catchError, of, tap } from 'rxjs';

export function catchWithFallback<T>(
  fallback: T,
  onError: (message: string) => void,
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.pipe(
      tap({ error: (err: Error) => onError(err.message) }),
      catchError(() => of(fallback)),
    );
}
