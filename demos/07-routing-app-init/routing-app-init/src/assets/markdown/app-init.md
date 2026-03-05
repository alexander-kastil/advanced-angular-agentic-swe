- Examine the two `APP_INITIALIZER's` registered in `app.config.ts`:

- `AppInitServices` implemented in `app-init.service.ts` is loading some required startup data.

- `ConfigService` implemented in `config.service.ts` is loading the configuration data. This is a simple example of how to load configuration data from a JSON file.


```typescript
providers: [
{
    provide: APP_INITIALIZER,
    useFactory: initFactory,
    deps: [AppInitService],
    multi: true,
},
{
    provide: APP_INITIALIZER,
    useFactory: configFactory,
    deps: [ConfigService],
    multi: true,
}
```
