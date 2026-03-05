- Examine `error.handler.ts`:

```typescript
export class GlobalErrorHandler implements ErrorHandler {
  injector = inject(Injector);

  handleError(error: Error | HttpErrorResponse) {
    const router = this.injector.get(Router);
    console.warn('An error occurred:', error);
    if (error.message) {
      console.warn('Err Message:', error.message);
    }
    router.navigate(['/error'], { state: { data: (error as Error).message } });
  }
}
```

- Examine its registration in `app.config.ts`:

```typescript
{
    provide: ErrorHandler,
    useClass: GlobalErrorHandler,
},
```