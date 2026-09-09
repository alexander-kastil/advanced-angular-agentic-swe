import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { AuthStore } from './auth/auth-store';
import { provideWorkbenchTools } from './agent/workbench-tools';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
  withIncrementalHydration,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAppInitializer(() => inject(AuthStore).restore()),
    provideWorkbenchTools(),
    provideClientHydration(
      withIncrementalHydration(),
      // Only the anonymous status call may be carried over; an authorized response must not be.
      withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: false }),
    ),
  ],
};
