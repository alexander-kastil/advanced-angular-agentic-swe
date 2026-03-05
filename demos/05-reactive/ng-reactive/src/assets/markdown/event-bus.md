- EventBus pattern which basically is a stateful service, allows communication between components that are not directly nested like `Container / Presenter`.

- Examine `demo-container.component.html` and the div for the mock editor:

  ```html
  <div class="gdEditor" *ngIf="showMdEditor ">
    <app-markdown-editor></app-markdown-editor>
  </div>
  ```

- Examine `sidenav.service.ts`. It toggles the responsive behaviour of the `mat-sidenav` in `demo-container.component.html` and is using a `BehaviourSubject` to implement a stateful service.

- It is also injected to `navbar.component.ts` to toggle the sidenav from the navbar.

  ```typescript
  export class SideNavService {
    ...
    visible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    position$: BehaviorSubject<MatDrawerMode> = new BehaviorSubject<MatDrawerMode>('side');
  ```

- We will refactor `sidenav.service.ts to the ngrx state later on
