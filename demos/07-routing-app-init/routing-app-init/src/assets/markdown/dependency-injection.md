- Examine the use of `inject` in `di-inject.component.ts`. It replaces the use of the constructor for dependency injection.

  ```typescript
  @Component({
    selector: 'app-di-inject',
    templateUrl: './di-inject.component.html',
    styleUrls: ['./di-inject.component.scss']
  })
  export class DiInjectComponent {
    service = inject(DemoService);
    demos = this.service.getItems();
  }
  ```

- Examine the registration of the `HttpClient` in `demo.module.ts`. It does not import the `HttpClientModule`. Instead it used on of the many `provide()` functions which is the basis of being able to use function based interceptors. If you do not used `Interceptors`, you can skip it.

  ```typescript
  providers: [
      provideHttpClient(
        withInterceptorsFromDi()
      ),
  ],
  ```