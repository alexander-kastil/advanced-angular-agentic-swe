- Without a transfer cache, server rendering doubles the work: the server fetches the data to render, then the browser fetches exactly the same data again to hydrate. The user sees content, then a flicker.

- Angular 22 has two separate mechanisms for this, and they key on different things.

## httpResource, cached automatically

```typescript
readonly catalog = httpResource<FoodItem[]>(() => `${environment.api}food`);
```

- The **HTTP transfer cache** is enabled by `provideClientHydration()`. Responses to `GET` and `HEAD` requests made during server rendering are embedded in the document and replayed to the first matching client request.

- The key is derived from the request: method, URL and params. Nothing to declare.

- Tune it when the defaults exclude what you need:

```typescript
provideClientHydration(
  withEventReplay(),
  withHttpTransferCacheOptions({
    includeHeaders: ['x-offline-catalog'],
    includePostRequests: false,
  })
)
```

- Excluded by default: `POST`, requests carrying `Authorization` or `Cookie`, requests with credentials, and responses marked non-cacheable. `withNoHttpTransferCache()` turns the whole thing off.

- If the server and the browser reach the API on different origins, the cache will not match. `HTTP_TRANSFER_CACHE_ORIGIN_MAP`, provided **only** in the server config, maps one to the other.

## resource, cached by an id you choose

```typescript
readonly summary = resource<CatalogSummary, unknown>({
  id: 'food-summary',
  loader: async () => summarise(await this.food.getCatalog()),
});
```

- `resource()` does not go through `HttpClient`, so the HTTP cache cannot see it. The `id` option keys the resolved value into `TransferState` instead.

- The id must be **identical on both sides**, which it is here because both sides run the same code.

- Verified against `@angular/core` 22.1.4: `id` is declared on `BaseResourceOptions`, so `resource()` and `rxResource()` accept it. **`HttpResourceOptions` has no `id`** - `httpResource` relies on the HTTP transfer cache and there is nothing to pass.

## Reading the demo honestly

- Two counters in the demo tell you whether it worked:
    - **loader runs in this browser** should be `0`. A run means `TransferState` had no value for `food-summary`.
    - **browser requests to /food** should be `0`. Sampled from `performance.getEntriesByType('resource')` after the first render.

- Both numbers are only meaningful after a **hard reload** of this route. Arriving by client-side navigation means no server render happened, so there was nothing to transfer.

- The cache is single-use. It answers the first matching request and is dropped once the app stabilises, so a later `reload()` really does hit the network. That is deliberate: stale data after the first paint would be worse than a request.
