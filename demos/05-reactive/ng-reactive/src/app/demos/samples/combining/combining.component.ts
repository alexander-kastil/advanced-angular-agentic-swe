import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { concat, forkJoin, interval, merge, of, zip } from 'rxjs';
import { combineLatestWith, map, take, tap } from 'rxjs/operators';
import { AccountService } from '../../vouchers/account.service';
import { VouchersService } from '../../vouchers/voucher.service';
import { DoublerService } from '../operators/doubler.service';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-combining',
  templateUrl: './combining.component.html',
  styleUrls: ['./combining.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CombiningComponent {
  vs = inject(VouchersService);
  as = inject(AccountService);
  ds = inject(DoublerService);

  useConcat() {
    // Create a time that emits a value from array every x milliseconds
    const arrA = [1, 2, 3, 4, 5];
    const sourceA$ = interval(500).pipe(
      take(arrA.length),
      map((i) => arrA[i])
    );

    const arrB = ['a', 'b', 'c'];
    const sourceB$ = interval(300).pipe(
      take(arrB.length),
      map((i) => arrB[i])
    );

    console.log('concat');
    concat(sourceA$, sourceB$).subscribe(console.log);
  }

  useMerge() {
    const arrA = [1, 2, 3, 4, 5];
    const sourceA$ = interval(500).pipe(
      take(arrA.length),
      map((i) => arrA[i])
    );
    const arrB = ['a', 'b', 'c'];
    const sourceB$ = interval(300).pipe(
      take(arrB.length),
      map((i) => arrB[i])
    );

    console.log('merge');
    merge(sourceA$, sourceB$).subscribe(console.log);
  }

  useZip() {
    const age$ = of(27, 25, 29);
    const name$ = of('Sepp', 'Mark', 'Susi');
    const isDev$ = of(true, true, false);

    zip(age$, name$, isDev$)
      .pipe(map(([age, name, isDev]) => ({ age, name, isDev })))
      .subscribe((x) => console.log(x));
  }

  useForkJoin() {
    const response1 = this.ds.double(3);
    const response2 = this.ds.double(9);
    const response3 = this.ds.double(2);

    forkJoin([response1, response2, response3]).subscribe((arr) => {
      console.log('forkJoin', arr);
    });
  }

  leftJoin() {
    //get vouchers with prop Account being null -
    //simulates sql left join of two entities
    const vouchers$ = this.vs.getVoucher(2).pipe(
      map((v) => v?.Details),
      tap((d) => console.log('vouchers before combining', d))
    );

    const accounts$ = this.as.getAccounts();

    let combined = vouchers$.pipe(
      combineLatestWith(accounts$),
      map(([vouchers, accounts]) => {
        if (vouchers && accounts) {
          return vouchers.map((d) => ({
            ...d,
            Account: accounts.find((a) => d.AccountID === a.ID)?.Name,
          }));
        }
        return [];
      })
    );

    combined.subscribe((item) => console.log('After combining', item));
  }
}
