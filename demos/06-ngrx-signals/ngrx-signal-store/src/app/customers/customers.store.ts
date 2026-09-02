import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { Customer } from './customer.model';
import { CustomersService } from './customers.service';

type CustomersState = {
    customers: Customer[];
    loading: boolean;
    filter: string;
};

const initialCustomersState: CustomersState = {
    customers: [],
    loading: false,
    filter: '',
};

const logError = (error: Error) => console.error('error: ', error);

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
        addCustomer: rxMethod<Customer>(
            pipe(
                switchMap((customer) => {
                    patchState(store, { loading: true });
                    return service.addCustomer(customer).pipe(
                        tapResponse({
                            next: (created) => patchState(store, { customers: [...store.customers(), created] }),
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        updateCustomer: rxMethod<Customer>(
            pipe(
                switchMap((customer) => {
                    patchState(store, { loading: true });
                    return service.updateCustomer(customer).pipe(
                        tapResponse({
                            next: (saved) => patchState(store, {
                                customers: store.customers().map((c) => (c.id === saved.id ? saved : c)),
                            }),
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        deleteCustomer: rxMethod<Customer>(
            pipe(
                switchMap((customer) => {
                    patchState(store, { loading: true });
                    return service.deleteCustomer(customer).pipe(
                        tapResponse({
                            next: () => patchState(store, {
                                customers: store.customers().filter((c) => c.id !== customer.id),
                            }),
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        getById: (id: number) => store.customers().find((c) => c.id === id),
        setFilter: (filter: string) => patchState(store, { filter }),
    })),
    withComputed((store) => ({
        count: computed(() => store.customers().length),
        nextId: computed(() => store.customers().reduce((max, c) => (c.id > max ? c.id : max), 0) + 1),
        filtered: computed(() => {
            const term = store.filter().toLowerCase();
            return term
                ? store.customers().filter((c) => c.name.toLowerCase().includes(term))
                : store.customers();
        }),
    })),
    withHooks({
        onInit({ fetchCustomers }) {
            fetchCustomers();
        },
    })
);
