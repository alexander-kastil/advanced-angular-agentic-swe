import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withPreloading } from '@angular/router';
import { DefaultDataServiceConfig, provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { foodDataServiceConfig } from './food/state/food-data.service.config';
import { entityConfig } from './food/state/food.metadata';
import { FlagBasedPreloadingStrategy } from './preloading-strategy';
import { appState } from './state/app.state';
import { provideRouterStore } from '@ngrx/router-store';

export const appConfig: ApplicationConfig = {
    providers: [
    provideRouter(routes, withPreloading(FlagBasedPreloadingStrategy)),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideStore(),
    provideState(appState),
    provideEffects(),
    { provide: DefaultDataServiceConfig, useValue: foodDataServiceConfig },
    provideEntityData(entityConfig, withEffects()),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() , connectInZone: true}),
    provideRouterStore()
],
};