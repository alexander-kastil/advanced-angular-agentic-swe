# Migrate Stateful Service to NgRx

In this lab we will solve the following tasks:

- Migrate SideNavService to use NgRx. You can take the demo app as a reference or use the guide below
- Replace FoodService with NgRx Data

### Migrate SideNavService to use NgRx

NgRx installation:

```
ng add @ngrx/store
ng add @ngrx/store-devtools
```

Make sure that `app/app.config.ts` matches the following code:

```typescript
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideAnimations(),
        provideStore(),
        provideState(appState),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
    ],
};
```

Create the actions in `app/state/app.actions.ts`:

```typescript   
export const appActions = createActionGroup(
  {
    source: 'app',
    events: {
      toggleSideNav: emptyProps(),
      changeSideNavVisible: props<{ visible: boolean }>(),
      changeSideNavPosition: props<{ position: string }>(),
    },
  }
);
```

Create the state in `app.state.ts`:

```typescript
export interface AppState {
  sideNavVisible: boolean;
  sideNavPosition: MatDrawerMode;
}

export const initialAppState: AppState = {
  sideNavVisible: true,
  sideNavPosition: 'side'
};

export const appState = createFeature({
  name: 'app',
  reducer: createReducer(
    initialAppState,
    on(appActions.toggleSideNav, (state) => ({
      ...state,
      sideNavVisible: !state.sideNavVisible,
    })),
    on(appActions.changeSideNavVisible, (state, action) => ({
      ...state,
      sideNavVisible: action.visible,
    })),
    on(appActions.changeSideNavPosition, (state, action) => ({
      ...state,
      sideNavPosition: action.position as MatDrawerMode,
    }))
  )
})
```

Create a folder `app/state` and add the following code to index.ts:

```typescript
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { AppState, appState } from './app.state';

export interface State {
  app: AppState;
}

export const reducers: ActionReducerMap<State> = {
  app: appState.reducer,
};

export const metaReducers: MetaReducer<State>[] = [];
```

Create a `app/state/sidenav.facades.ts` which is responsible to provide the responsive sideNav container. We decided to use a facades to encapsulate the BreakpointObserver logic, and thereby keep the component as simple as possible. 

```typescript
@Injectable({
  providedIn: 'root',
})
export class SideNavFacade {
  breakpointObserver = inject(BreakpointObserver);
  store = inject(Store<AppState>);

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        tap((matchesBreakpoints) => {
          console.log("matchesBreakpoint: ", matchesBreakpoints.matches);
          const position: MatDrawerMode = matchesBreakpoints.matches ? 'over' : 'side';
          const visible = matchesBreakpoints.matches ? false : true;
          this.store.dispatch(appActions.changeSideNavVisible({ visible }));
          this.store.dispatch(appActions.changeSideNavPosition({ position }));
        })
      ).subscribe();
  }

  getSideNavVisible() {
    return this.store.select(appState.selectSideNavVisible);
  }

  getSideNavPosition() {
    return this.store.select(appState.selectSideNavPosition);
  }

  toggleMenuVisibility() {
    this.store.dispatch(appActions.toggleSideNav());
  }
}
```

Run the app and check the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd). You should see the initial state of the app.

![Redux DevTools](_images/redux-dev-tools.png)

Open `navbar.component.ts` and inject the SideNavFacade instead of the SideNavService:

```typescript
export class NavbarComponent {
  ns = inject(NavbarService);
  nav = inject(SideNavFacade);
  items = this.ns.getTopItems();

  toggleMenu() {
    this.nav.toggleMenuVisibility();
  }
}
```

Open `app.component.ts` and inject the SideNavFacade instead of the SideNavService. Also, update the code to use the new facade:

```typescript
nav = inject(SideNavFacade);
...
sidenavMode = this.nav.getSideNavPosition();
sidenavVisible = this.nav.getSideNavVisible();
```

Update the code in in app.component.html:

```html
<mat-sidenav
    #sidenav class="sidebar"
    [opened]="sidenavVisible | async" 
    [mode]="(sidenavMode | async) ?? 'side'">
    ...    
</mat-sidenav>
```

Congratulations! You have successfully migrated the responsive SideNav to NgRx.

### Replace FoodService with NgRx Data

NgRx Data is a library that provides a single API for all CRUD operations. It is based on NgRx and uses the Entity pattern.

NgRx Data installation:

```bash
npm i -S @ngrx/data
```

Define the entity metadata in `food.metadata.ts`:

```typescript
import { EntityMetadataMap } from '@ngrx/data';
import { FoodItem } from '../food.model';

export function sortByName(a: FoodItem, b: FoodItem): number {
  let comp = a.name.localeCompare(b.name);
  return comp;
}

export const entityMetadata: EntityMetadataMap = {
  Food: {
    selectId: (food: FoodItem) => food.id,
    sortComparer: sortByName,
  },
};

export const entityConfig = {
  entityMetadata,
};
```

Because we are using a non-default url for the backend, we need to configure the default data service. Create `food-data-service.config.ts`:

```typescript
import { DefaultDataServiceConfig } from '@ngrx/data';
import { environment } from '../../../environments/environment';

export const foodDataServiceConfig: DefaultDataServiceConfig = {
    root: `${environment.api}/`,
    timeout: 3000,
    entityHttpResourceUrls: {
        Food: {
            entityResourceUrl: `${environment.api}/food/`,
            collectionResourceUrl: `${environment.api}/food`
        },
    }
}
```

Add the following code to `app.config.ts` in order to configure the entity data service:

```typescript 
providers: [
  ...
  { provide: DefaultDataServiceConfig, useValue: foodDataServiceConfig },
  provideEffects(),
  provideEntityData(entityConfig, withEffects())
  ...
  ]
```

Create `food/state/food-entity.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import { FoodItem } from '../food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodEntityService extends EntityCollectionServiceBase<FoodItem> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Food', serviceElementsFactory);
  }
}
```

Replace the FoodService with the FoodEntityService in `food-container.component.ts`. You will need to add the required imports by yourself: 

```typescript
fs = inject(FoodEntityService);
  food = this.fs.entities$;
  selected: FoodItem | undefined = undefined;

  ngOnInit(): void {
    this.fs.getAll();
  }

  selectFood(f: FoodItem) {
    this.selected = { ...f };
  }

  addFood() {
    this.selected = new FoodItem();
  }

  saveFood(f: FoodItem) {
    f.id == 0 ? this.fs.add(f) : this.fs.update(f);
  }
```

Now it is time to test the app. Run the app and check the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd). You should see the initial state of the app. Navigate to the Food page and add a new food item. You should see the new item in the Redux DevTools.

Navigate to the About page and back to the Food page. Notice that the `@ngrx/data/query-all` action is dispatched. This is because the data service is configured to load all food items in `ngOnInit`. We will fix this in the next step using the loaded flag.

```typescript
  ngOnInit(): void {
    this.fs.loaded$.subscribe((loaded) => {
      if (!loaded) {
        this.fs.getAll();
      }
    })
  }
```

You can now delete `food.service.ts` as it is no longer needed. If you need to override individual methods you could implement a custom data service. See the [documentation](https://ngrx.io/guide/data/entity-dataservice) for more details.

If you want to add your own implementation of the data service, you can register it in app.config.ts using:

```bash
{
    provide: ENVIRONMENT_INITIALIZER,
    useValue() {
        const entityDataService = inject(EntityDataService);
        const foodDataService = inject(FoodDataService);
        entityDataService.registerService('Food', foodDataService);
    },
    multi: true,
},
```

A typical implementation of a custom data service looks like this:

```typescript
@Injectable({
  providedIn: 'root'
})
export class FoodDataService extends DefaultDataService<FoodItem>{

  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Food', http, httpUrlGenerator);
  }

  override add(food: FoodItem): Observable<FoodItem> {
    console.log('overriding add');
    return this.http.post<FoodItem>(`${environment.api}/food`, food).pipe(
      map((data) => {
        return { ...food, id: data.id };
      })
    );
  }
}
```