import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { BorderDirective, CenteredDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-rxjs-interop',
  imports: [
    MatButtonModule,
    BorderDirective,
    CenteredDirective
  ],
  templateUrl: './rxjs-interop.component.html',
  styleUrl: './rxjs-interop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RxjsInteropComponent {
  amount$ = of(10);
  amount = toSignal(this.amount$, { initialValue: 0 });
  writeableAmount = signal(this.amount());

  // creates a writeable signal that is bound to the amount signal
  // an alternative could to subscribe the observable and create a writeable signal
  createWriteAmount = effect(() => {
    this.writeableAmount.set(this.amount());
  }, { allowSignalWrites: true });

  updateAmount() {
    // this.amount.set(this.writeAmount());
    this.writeableAmount.update(curr => curr + 1);
  }
}