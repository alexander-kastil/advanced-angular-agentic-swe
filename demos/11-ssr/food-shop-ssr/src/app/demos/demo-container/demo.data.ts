import { DemoItem } from './demo-item.model';

export const FALLBACK_DEMOS: DemoItem[] = [
  {
    id: 1,
    url: 'server-routes',
    title: 'Server Routes & Render Modes',
    teaches: 'Declare a RenderMode per route in app.routes.server.ts. Prerender parameterised routes with getPrerenderParams() and cover unknown ids with PrerenderFallback.Server. Needs outputMode: server in angular.json or the file is ignored.',
    sortOrder: 1,
    topic: 'Server Rendering',
    md: 'server-routes'
  },
  {
    id: 2,
    url: 'node-app-engine',
    title: 'Express 5 & AngularNodeAppEngine',
    teaches: 'Walk the v22 server.ts: express.static for the browser bundle, AngularNodeAppEngine.handle() for everything else, writeResponseToNodeResponse to stream it back, createNodeRequestHandler for serverless hosts. CommonEngine and the Express 4 wildcard are gone.',
    sortOrder: 2,
    topic: 'Server Rendering',
    md: 'node-app-engine'
  },
  {
    id: 3,
    url: 'incremental-hydration',
    title: 'Incremental Hydration Triggers',
    teaches: 'Compare @defer (hydrate on interaction), (hydrate on viewport), (hydrate on immediate) and (hydrate never) side by side. Each block reports the moment it hydrated, so the never block is visibly server HTML that never boots.',
    sortOrder: 3,
    topic: 'Hydration',
    md: 'incremental-hydration'
  },
  {
    id: 4,
    url: 'transfer-cache',
    title: 'State Transfer Cache',
    teaches: 'Stop the client refetching what the server already fetched. httpResource rides the automatic HTTP transfer cache; resource() takes an explicit id that keys it into TransferState. The demo counts the browser network entries for both.',
    sortOrder: 4,
    topic: 'Hydration',
    md: 'transfer-cache'
  },
  {
    id: 5,
    url: 'route-params-signals',
    title: 'Route Params as Signal Inputs',
    teaches: 'withComponentInputBinding() delivers :id straight into an input() signal, so a server-rendered component reads its params without ActivatedRoute, toSignal or a subscription.',
    sortOrder: 5,
    topic: 'Routing & Data',
    md: 'route-params-signals'
  },
  {
    id: 6,
    url: 'csr-vs-ssr-delta',
    title: 'CSR vs SSR Measured Delta',
    teaches: 'The two render paths measured rather than guessed: prerendered HTML, server-rendered HTML and the client-only shell compared on payload bytes and time to first byte, with the exact commands that produced the numbers.',
    sortOrder: 6,
    topic: 'Measuring & Testing',
    md: 'csr-vs-ssr-delta'
  }
];
