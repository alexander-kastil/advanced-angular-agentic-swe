import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { appState } from './state/app.state';
import { provideEffects } from '@ngrx/effects';
import { DefaultDataServiceConfig, provideEntityData, withEffects } from '@ngrx/data';
import { entityConfig } from './food/state/food.metadata';
import { foodDataServiceConfig } from './food/state/food-data.service.config';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideStore(),
        provideState(appState),
        provideEffects(),
        { provide: DefaultDataServiceConfig, useValue: foodDataServiceConfig },
        provideEntityData(entityConfig, withEffects()),
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() , connectInZone: true})
    ],
};