import { describe, expect, it } from 'vitest';
import { defer, firstValueFrom, of, throwError } from 'rxjs';
import { retryWithBackoff } from './retry-with-backoff';

describe('retryWithBackoff', () => {
  it('retries a server error until it succeeds', async () => {
    let calls = 0;
    const source = defer(() => {
      calls += 1;
      return calls < 3 ? throwError(() => ({ status: 503 })) : of('stored');
    });

    await expect(firstValueFrom(source.pipe(retryWithBackoff(3, 1)))).resolves.toBe('stored');
    expect(calls).toBe(3);
  });

  it('gives up after the configured attempts', async () => {
    let calls = 0;
    const source = defer(() => {
      calls += 1;
      return throwError(() => ({ status: 500 }));
    });

    await expect(firstValueFrom(source.pipe(retryWithBackoff(2, 1)))).rejects.toBeTruthy();
    expect(calls).toBe(3);
  });

  it('does not retry a client error', async () => {
    let calls = 0;
    const source = defer(() => {
      calls += 1;
      return throwError(() => ({ status: 400 }));
    });

    await expect(firstValueFrom(source.pipe(retryWithBackoff(3, 1)))).rejects.toBeTruthy();
    expect(calls).toBe(1);
  });
});
