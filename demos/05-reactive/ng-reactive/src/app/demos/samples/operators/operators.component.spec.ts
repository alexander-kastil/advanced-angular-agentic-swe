import { map } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

describe('Operators Marble Testing', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('useMap', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-abc-d-|', { a: 1, b: 2, c: 3, d: 4 });
      const piperesult$ = source$.pipe(map((el) => el + 10));
      const expected = '-abc-d-|';

      expectObservable(piperesult$).toBe(expected, {
        a: 11,
        b: 12,
        c: 13,
        d: 14,
        f: 15,
      });
    });
  });
});
