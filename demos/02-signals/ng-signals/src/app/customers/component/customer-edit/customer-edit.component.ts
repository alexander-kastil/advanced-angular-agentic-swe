import { Component, computed, inject, input } from '@angular/core';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
})
export class CustomerEditComponent {
  readonly id = input.required<number, string>({ transform: (v) => Number(v) });
  readonly readonly = input<boolean>();

  private service = inject(CustomersService);
  readonly customer = computed(() => this.service.customers.value().find((c) => c.id === this.id()));
}
