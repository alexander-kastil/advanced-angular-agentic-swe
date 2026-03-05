import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { Customer } from './customer.model';
import { pipe, switchMap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { CustomersService } from './customers.service';

type CustomersState = {
    customers: Customer[];
    loading: boolean;
    filter: string;
    selectedCustomer: Customer | null;
}

const initialCustomersState: CustomersState = {
    customers: [],
    loading: false,
    filter: '',
    selectedCustomer: null,
};

const logError = (error: Error) => console.error("error: ", error);

export const customersStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialCustomersState),
    withMethods((store, service = inject(CustomersService)) => ({
        fetchCustomers: rxMethod<void>(
            pipe(
                switchMap(() => {
                    patchState(store, { loading: true });
                    return service.getCustomers().pipe(
                        tapResponse({
                            next: (customers) => patchState(store, { customers }),
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        selectCustomer(customer: Customer | null) {
            patchState(store, { selectedCustomer: customer });
        },
        updateCustomer: rxMethod<Customer>(
            pipe(
                switchMap((customer) => {
                    patchState(store, { loading: true });
                    return service.updateCustomer(customer).pipe(
                        tapResponse({
                            next: (updated) => {
                                const allCustomers = [...store.customers()];
                                const index = allCustomers.findIndex(c => c.id === updated.id);
                                allCustomers[index] = updated;
                                patchState(store, { customers: allCustomers, selectedCustomer: null });
                            },
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        deleteCustomer: rxMethod<number>(
            pipe(
                switchMap((id) => {
                    patchState(store, { loading: true });
                    return service.deleteCustomer(id).pipe(
                        tapResponse({
                            next: () => {
                                patchState(store, {
                                    customers: store.customers().filter(c => c.id !== id),
                                    selectedCustomer: store.selectedCustomer()?.id === id ? null : store.selectedCustomer(),
                                });
                            },
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        addCustomer: rxMethod<Customer>(
            pipe(
                switchMap((customer) => {
                    patchState(store, { loading: true });
                    return service.addCustomer(customer).pipe(
                        tapResponse({
                            next: (created) => {
                                patchState(store, {
                                    customers: [...store.customers(), created],
                                    selectedCustomer: null,
                                });
                            },
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
    })),
    withComputed((store) => ({
        count: computed(() => store.customers().length),
        nextId: computed(() => store.customers().reduce((max, p) => p.id > max ? p.id : max, 0) + 1),
    })),
    withHooks({
        onInit({ fetchCustomers }) {
            fetchCustomers();
        },
    })
)
