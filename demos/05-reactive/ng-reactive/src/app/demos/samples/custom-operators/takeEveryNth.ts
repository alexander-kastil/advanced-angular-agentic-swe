import { filter } from "rxjs/operators";

export function takeEveryNth(n: number) {
  return filter((val, i) => i % n === 0);
}
