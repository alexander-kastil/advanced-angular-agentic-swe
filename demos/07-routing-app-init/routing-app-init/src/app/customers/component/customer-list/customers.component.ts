import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [RouterLink],
})
export class CustomersComponent {
  private service = inject(CustomersService);
  readonly customers = this.service.customers;
}
