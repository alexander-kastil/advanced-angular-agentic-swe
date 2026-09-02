import { Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [MatButton, RouterLink],
})
export class CustomersComponent {
  private service = inject(CustomersService);

  readonly filter = signal('');
  readonly customers = computed(() => {
    const term = this.filter().toLowerCase();
    const all = this.service.customers.value();
    return term ? all.filter((c) => c.name.toLowerCase().includes(term)) : all;
  });
}
