# Food App Project - Implementing Reactive Forms

In this lab we will solve the following tasks:

- Convert the project to bootstrap and use standalone components

- Refactor `food-edit.component` to be implemented as a Reactive Form using [FormBuilder](FormBuilder).

    >Note: You can take the following components as a [reference](../../demos/01-components/02-component-forms/ng-components-forms/src/app/demos/samples/forms-builder/):

- Implement Validation for the name filed to be required with min length of 3 and the price filed to be positive

    ![edit-form](_images/edit-form.png)

    > Note: You can take the following components as a [reference](../../demos/01-components/02-component-forms/ng-components-forms/src/app/demos/samples/validaton-intro):

## Convert the project to bootstrap and use standalone components

- Convert the project to use standalone components by running the following command two times:    

    ```bash
    ng g @angular/core:standalone
    ```    

    - On the first run select: Convert all components, directives and pipes to standalone

    - On the second run select: Bootstrap the application using standalone APIs

    >Note: When converting projects `app.routes.ts` and `app.config.ts` are not created automatically. You have to do this manually.

- Open `main.ts` and use `F1: Visual Studio Code - Organize Imports` to clean up the imports

- To add the routing configuration create a new file `app/app.routes.ts` and add the following content. Replace the existing lazy loading of the food `food-routing.module.ts` with component lazy loading in the routes configuration:

    ```typescript
    import { Routes } from '@angular/router';
    import { HomeComponent } from './home/home.component';
    import { AboutComponent } from './about/about.component';

    export const routes: Routes = [
        { path: "", component: HomeComponent },
        { path: "food", loadComponent: () => import('./food/food-container/food-container.component').then(m => m.FoodContainerComponent) },
        { path: "about", component: AboutComponent }
    ];
    ```

- Add an `app/app.config.ts` to provide the app configuration like providers, ...

    ```typescript
    export const appConfig: ApplicationConfig = {
        providers: [
            ...
            provideRouter(routes),
            provideHttpClient(withInterceptorsFromDi()),
            provideAnimations()
        ],
    };
    ```

- Update `main.ts`:

    ```typescript
    import { bootstrapApplication } from '@angular/platform-browser';
    import { AppComponent } from './app/app.component';
    import { appConfig } from './app/app.config';

    bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
    ```

- Manually remove the following items:

    - app-routing.module.ts
    - food.module.ts
    - food-routing.module.ts    
    
## Refactor `food-edit.component` to be implemented as a Reactive Form using FormBuilder

-   Import `ReactiveFormsModule` to `food-edit.component.ts`

-   Inject FormBuilder to `food-edit.component.ts` using the `inject()` token and initialize the `foodForm : FormGroup`. Add a `minLength` validator to the name field and a min validator to the price field.

    ```typescript
    fb = inject(FormBuilder);
    ```

-   Initialize `@Input()` food with a `new FoodItem()` in `food-edit.component.ts`

    ```typescript
    @Input() food: FoodItem = new FoodItem();
    ```

-   Add a form field for the id in `food-edit.component.html`

    ```html
    <mat-form-field>
        <input matInput type="number" formControlName="id" />
    </mat-form-field>
    ```

-   Replace the ngModel bindings with formControlName bindings in `food-edit.component.html`. Example:

    ```html
        <mat-error
        *ngIf="
            foodForm.controls['name'].touched &&
            foodForm.controls['name'].errors != undefined
        "
        > Name is required & must be more than 3 chars
        </mat-error>
    ```

-   Add a from tag below the mat-card-content tag in `food-edit.component.html` and attach a formGroup directive to it

    ```html
    <mat-card-content>
    <form [formGroup]="foodForm" novalidate class="column">
    ```

-   Add the following [ngOnChanges](https://angular.dev/guide/components/lifecycle#ngonchanges) lifecycle event to `food-edit.component.ts`

    ```typescript
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['food']) {
        this.foodForm.setValue(changes['food'].currentValue);
        }
    }
    ```

-   Implement the onSubmit method in food-edit.component.ts

    ```typescript
    saveForm(): void {
      console.log('food to save', this.foodForm.value);
      this.onFoodSaved.emit(this.foodForm.value);
    }
    ```

-   Add the following `saveFood-method`to food-container.component.ts:

    ```typescript
    saveFood(f: FoodItem) {
        let arr = [...this.food]
        if (f.id == 0) {
            this.fs.addFood(f).subscribe((food) => {
            arr.push(food);
            this.food = arr;
            this.selected = undefined;
            });
        } else {
            this.fs.updateFood(f).subscribe((food) => {
            const index = arr.findIndex((f) => f.id === food.id);
            arr[index] = food;
            this.food = arr;
            this.selected = undefined;
            });
        }
    }
    ```