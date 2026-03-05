import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { EMPTY, Observable, interval, of, throwError } from 'rxjs';
import {
  catchError,
  finalize,
  map,
  retry,
  tap
} from 'rxjs/operators';
import { Voucher } from '../../vouchers/voucher.model';
import { VouchersService } from '../../vouchers/voucher.service';

@Component({
  selector: 'app-err-handling',
  templateUrl: './err-handling.component.html',
  styleUrls: ['./err-handling.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrHandlingComponent {
  vs = inject(VouchersService);

  completeStream() {
    // handle exceptions in the source / service
    const obs = (of(4, 6, 8, 'soi') as Observable<any>).pipe(
      map((nbr) => nbr / 2),
      catchError((err) => {
        console.log('handled in catchError', err);
        return EMPTY;
      })
    );

    // or in the subscriber / component
    obs.subscribe({
      next: (val: number) => console.log(val),
      error: (err: Error) => console.log('handled in handler-error', err),
      complete: () => console.log('completed'),
    }
    );
  }

  // Used in tryCatchAlike
  setLabel = (v: Voucher) => ({ ...v, Label: `${v.Text} costs € ${v.Amount}` });

  rethrowErr() {
    this.vs
      .getVouchers()
      .pipe(
        tap((data) => console.log('logged by tap(): ', data)),
        map((vs) => vs.map(this.setLabel)),
        catchError((err) => {
          console.log('Error on getVouchers()', err);
          return throwError(() => err);
        }),
        finalize(() => console.log('finalizing ...'))
      )
      .subscribe({
        next: (data) => console.log('tryCatchAlike result', data),
        error: (err) => console.log('tryCatchAlike error', err)
      });
  }

  fallbackValue() {
    const sampleItems = [
      {
        url: 'langfeatures',
        title: 'Language Features',
      },
      {
        url: 'creating',
        title: 'Creating Observables',
      },
    ];

    of(sampleItems)
      .pipe(
        catchError((err) => {
          console.log('caught mapping error and rethrowing', err);
          return throwError(() => err);
        }),
        finalize(() => console.log('first finalize() block executed')),
        catchError((err) => {
          console.log('rethrow error, providing fallback value', err);
          return of(sampleItems);
        }),
        finalize(() => console.log('second finalize() block executed'))
      )
      .subscribe(
        (res) => console.log('HTTP response', res),
      );
  }

  useRetry() {
    interval(1000)
      .pipe(
        map((val) => {
          if (val > 2) throw new Error('Invalid Value');
          return val;
        }),
        retry({ count: 5, delay: 2000 }),
        catchError((err) => err)
      )
      .subscribe(
        (val) => console.log(val)
      );
  }
}
