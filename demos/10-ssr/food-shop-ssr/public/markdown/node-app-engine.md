- `server.ts` in Angular 22 is roughly twenty lines. `AngularNodeAppEngine` owns route matching, render-mode selection and the prerendered-file lookup; the Express app is only plumbing.

```typescript
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.static(browserDistFolder, { maxAge: '1y', index: false, redirect: false }));

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  app.listen(process.env['PORT'] || 4000);
}

export const reqHandler = createNodeRequestHandler(app);
```

## The four pieces

| Symbol | Job |
|---|---|
| `AngularNodeAppEngine` | Matches the request against `serverRoutes` and renders, or returns `undefined` |
| `writeResponseToNodeResponse` | Streams a web `Response` into the Node `ServerResponse` |
| `isMainModule` | True only when this file is executed directly, so serverless imports do not start a listener |
| `createNodeRequestHandler` | Wraps the Express app for hosts that invoke a handler per request |

- `index: false` on `express.static` matters. Without it, `/` is answered with the CSR shell and rendering is bypassed for the one route that most needs it.

## Two things that changed under you

- **Express 5.** The Express 4 catch-all `server.get('*', ...)` throws a path-to-regexp error on Express 5. Use `app.use()` with no path.
- **CommonEngine.** Still exported from `@angular/ssr/node` in 22.1.6, but superseded. It rendered a single document with a hand-assembled provider list; `AngularNodeAppEngine` reads the render mode from `serverRoutes` instead.

## Verify the paths, do not assume them

```bash
npm run build
node dist/food-shop-ssr/server/server.mjs

curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4000/            # prerendered file
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4000/food/2      # prerendered file
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4000/food/99     # rendered per request
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4000/assets/images/falaffel.jpg
```

- A 400 on all four means `security.allowedHosts` is missing from `angular.json`, not that the server is broken.
