import { Component } from '@angular/core';
import { CustomersComponent } from '../../../../customers/customer-list/customers.component';

@Component({
    selector: 'app-spy-host',
    templateUrl: './spy-host.component.html',
    styleUrls: ['./spy-host.component.scss'],
    imports: [CustomersComponent],
})
export class SpyHostComponent {}
