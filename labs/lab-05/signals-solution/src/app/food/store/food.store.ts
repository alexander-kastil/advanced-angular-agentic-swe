import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FoodItem } from '../food.model';
import { FoodService } from '../food.service';

type FoodState = {
    food: FoodItem[];
    selectedFood: FoodItem | null;
    loading: boolean;
}

const initialState: FoodState = {
    food: [],
    selectedFood: null,
    loading: false,
}

const logError = (error: Error) => console.error("error: ", error);

export const foodStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialState),
    withComputed((store) => ({
        count: computed(() => store.food().length),
        nextId: computed(() => store.food().reduce((max, p) => p.id > max ? p.id : max, 0) + 1),
    })),
    withMethods((store, service = inject(FoodService)) => ({
        addFood: rxMethod<FoodItem>(
            pipe(
                switchMap((food: FoodItem) => {
                    patchState(store, { loading: true });
                    return service.addFood(food).pipe(
                        tapResponse({
                            next: (food) => {
                                const items = [...store.food(), food];
                                patchState(store, { food: items })
                            },
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )
        ),
        removeFood: rxMethod<number>(
            pipe(
                switchMap((id: number) => {
                    patchState(store, { loading: true });
                    return service.deleteFood(id).pipe(
                        tapResponse({
                            next: (food) => {
                                const items = store.food().filter((f: FoodItem) => f.id !== id);
                                patchState(store, { food: items })
                            },
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )
        ),
        updateFood: rxMethod<FoodItem>(
            pipe(
                switchMap((food: FoodItem) => {
                    patchState(store, { loading: true });
                    return service.updateFood(food).pipe(
                        tapResponse({
                            next: (food) => {
                                const allItems = [...store.food()];
                                const idx = allItems.findIndex((f: FoodItem) => f.id === food.id);
                                allItems[idx] = food;
                                patchState(store, { food: allItems })
                            },
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )
        ),
        selectFood: (id: number) => {
            const item = store.food().find((f: FoodItem) => f.id === id);
            patchState(store, { selectedFood: item })
        },
        loadFood: rxMethod<void>(
            pipe(
                switchMap(() => {
                    patchState(store, { loading: true });
                    return service.getFood().pipe(
                        tapResponse({
                            next: (food) => patchState(store, { food }),
                            error: logError,
                            finalize: () => patchState(store, { loading: false }),
                        })
                    );
                })
            )),
        addNew() {
            patchState(store, { selectedFood: { id: 0, name: '', price: 0, calories: 0 } })
        },
        clearSelected() {
            patchState(store, { selectedFood: null })
        }
    })),
    withHooks({
        onInit({ loadFood }) {
            loadFood();
        },
    })
)