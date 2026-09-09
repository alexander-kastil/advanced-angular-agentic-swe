import { MonoTypeOperatorFunction, retry, timer } from 'rxjs';

export function retryWithBackoff<T>(attempts = 3, firstDelay = 400): MonoTypeOperatorFunction<T> {
  return retry({
    count: attempts,
    delay: (error, retryCount) => {
      if (error?.status && error.status < 500) throw error;
      return timer(firstDelay * 2 ** (retryCount - 1));
    },
  });
}
