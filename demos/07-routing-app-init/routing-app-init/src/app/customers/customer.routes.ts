import { Routes } from '@angular/router';
import { CustomerEditComponent } from './component/customer-edit/customer-edit.component';
import { CustomersComponent } from './component/customer-list/customers.component';

export const customersRoutes: Routes = [
    {
        path: '',
        component: CustomersComponent,
    },
    {
        path: ':id',
        component: CustomerEditComponent,
    },
]