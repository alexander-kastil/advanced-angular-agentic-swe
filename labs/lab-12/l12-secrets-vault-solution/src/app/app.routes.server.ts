import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // The login screen has no per-user content, so it ships as static HTML.
  { path: 'login', renderMode: RenderMode.Prerender },

  // Public and cheap, so the server fetches the health once and hands it over hydrated.
  { path: 'status', renderMode: RenderMode.Server },

  // Everything behind the auth guard needs a token the server does not have.
  { path: 'secrets', renderMode: RenderMode.Client },
  { path: 'secrets/:listId', renderMode: RenderMode.Client },
  { path: 'secrets/:listId/:secretId', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Client },
];
