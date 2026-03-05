import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { from, interval, of } from 'rxjs';
import {
  delay,
  filter,
  find,
  map,
  mergeMap,
  reduce,
  take,
  tap
} from 'rxjs/operators';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { Voucher } from '../../vouchers/voucher.model';
import { VouchersService } from '../../vouchers/voucher.service';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    BoxedDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperatorsComponent implements OnInit {
  vs = inject(VouchersService);
  response: any;

  // Declarative Pattern
  vouchers$ = this.vs.getVouchers();

  // Imperative Pattern
  vouchers: Voucher[] = [];

  ngOnInit() {
    //Classic Subscribe (Imperative) Pattern -> Unsubscribe
    this.vs.getVouchers().subscribe((vs) => {
      this.vouchers = vs;
    });
  }
  setLabel = (v: Voucher) => ({ ...v, Label: `${v.Text} costs € ${v.Amount}` });

  log = (msg: string, data: any) =>
    console.log(
      `executing: ${msg}, 'data' is Array: ${Array.isArray(data)}`,
      data
    );

  useMap() {
    const source = from([1, 2, 3, 4, 5]);
    source
      .pipe(map((el) => el + 10))
      .subscribe((val) => console.log('value:', val));

    this.vouchers$
      .pipe(
        map((vouchers) => {
          return vouchers.map((v) => (
            {
              ...v,
              Label: `${v.Text} costs € ${v.Amount}`,
            }
          ));
        })
      )
      .subscribe((data) => this.log('use map()', data));
  }

  useTap() {
    const arr = [1, 4, 6, 7, 9, 11];
    console.log('array:', arr);

    from(arr)
      .pipe(
        tap((el) => {
          //logging
          (el = el * 2), console.log('tap:', el);
          //side effect
          // call rest service with value to do distributed logging
          // enable / disable spinner
        })
      )
      .subscribe((val) => console.log('subscribe', val));
  }

  // JavaScript Array.find - not an observable operator
  useFindArr() {
    this.vouchers$
      .pipe(
        map((vs) => vs.find((v: Voucher) => v.ID === 3))
      )
      .subscribe((data) => this.log('getByID - using find()', data));
  }

  // RxJs find Operator
  useFind() {
    this.vouchers$
      .pipe(
        mergeMap((vouchers: Voucher[]) => vouchers),
        find((v) => v.ID === 3)
      )
      .subscribe((data) => this.log('getByID - using find()', data));
  }

  // JavaScript Array.filter - not an observable operator
  useFilterArr() {
    this.vouchers$
      .pipe(
        map((vs) => vs.filter((v: Voucher) => v.Paid))
      )
      .subscribe((data) => this.log('useFilter', data));
  }

  useFilter() {
    this.vouchers$
      .pipe(
        mergeMap((vouchers: Voucher[]) => vouchers),
        filter((v) => v.Paid)
      )
      .subscribe((data) => this.log('getByID - using find()', data));
  }

  // Compare the two outputs
  useTake() {
    this.vouchers$.pipe(take(3)).subscribe((data) => this.log('useTake', data));
  }

  useInterval() {
    interval(1000)
      .pipe(take(3))
      .subscribe((x) => console.log(x));
  }

  useDelay() {
    const delayedObservable = of(['hund', 'katze', 'maus']).pipe(delay(5000));
    console.log('before delay execution - waiting 5 secs');
    delayedObservable.subscribe((data) => console.log(data));
  }

  useReduce() {
    const arr = [1, 4, 6, 7, 9, 11];

    from(arr)
      .pipe(reduce((acc, curr) => acc + curr, 0))
      .subscribe((d) => console.log("Sum from array: ", d));

    this.vouchers$.pipe(
      mergeMap((vouchers: Voucher[]) => vouchers),
      reduce((acc, curr) => { acc = acc + curr.Amount; return acc }, 0)
    ).subscribe(sum => console.log("Sum of vouchers: ", sum));
  }
}
