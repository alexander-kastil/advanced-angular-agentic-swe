import { TestScheduler } from 'rxjs/testing';
import { filterOnlyEven } from './filterOnlyEven';

describe('filterOnlyEven', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should remove odd numbers', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('abc|', { a: 1, b: 2, c: 3 });
      const result$ = source$.pipe((n) => filterOnlyEven(n));
      const expected = '-b-|';

      expectObservable(result$).toBe(expected, { b: 2 });
    });
  });
});
