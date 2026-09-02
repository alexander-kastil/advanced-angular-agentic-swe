import { describe, expect, it } from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import { catchWithFallback } from './catch-with-fallback';

describe('catchWithFallback', () => {
  const scheduler = () =>
    new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

  it('passes values through untouched', () => {
    scheduler().run(({ cold, expectObservable }) => {
      const source$ = cold('a-b|', { a: 1, b: 2 });
      const result$ = source$.pipe(catchWithFallback(0, () => {}));

      expectObservable(result$).toBe('a-b|', { a: 1, b: 2 });
    });
  });

  it('replaces an error with the fallback and reports it', () => {
    const messages: string[] = [];

    scheduler().run(({ cold, expectObservable }) => {
      const source$ = cold('a-#', { a: 1 }, new Error('boom'));
      const result$ = source$.pipe(catchWithFallback(-1, (m) => messages.push(m)));

      expectObservable(result$).toBe('a-(f|)', { a: 1, f: -1 });
    });

    expect(messages).toEqual(['boom']);
  });
});
