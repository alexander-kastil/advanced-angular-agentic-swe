import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CustomersComponent } from '../../../customers/customer-list/customers.component';

@Component({
    selector: 'app-async',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './async.component.html',
    styleUrls: ['./async.component.scss'],
    imports: [CustomersComponent],
})
export class AsyncComponent {}
