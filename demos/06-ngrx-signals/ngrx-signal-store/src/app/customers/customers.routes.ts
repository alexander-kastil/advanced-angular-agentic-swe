import { Routes } from '@angular/router';
import { CustomersComponent } from './customer-list/customers.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';

export const customerRoutes: Routes = [
    {
        path: '',
        component: CustomersComponent
    },
    {
        path: ':id',
        component: CustomerEditComponent,
    }
];

