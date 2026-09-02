import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { foodRoutes } from './app.routes';
import { offlineCatalogInterceptor } from './offline-catalog.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([offlineCatalogInterceptor])),
    provideRouter(foodRoutes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
  ],
};
