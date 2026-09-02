import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  imports: [JsonPipe],
})
export class CustomerEditComponent {
  readonly id = input.required({ transform: (value: string | number) => Number(value) });
  readonly readonly = input(false, { transform: (value: string | boolean) => value === true || value === 'true' });

  private service = inject(CustomersService);

  readonly customer = computed(() =>
    this.service.customers().find((c) => c.id === this.id())
  );
}
