import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { customerState } from '../../state/customers.state';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, JsonPipe]
})
export class CustomerEditComponent {
  id = input.required<number>();
  readonly readonly = input<boolean>();

  store = inject(Store);
  customer = this.store.select(customerState.selectCustomers).pipe(
    mergeMap(
      (customers) => customers.filter(c => c.id == this.id())
    ));
}
