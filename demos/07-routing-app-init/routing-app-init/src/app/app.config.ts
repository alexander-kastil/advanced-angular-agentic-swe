import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, importProvidersFrom, provideAppInitializer, inject, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { DefaultDataServiceConfig, provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MarkdownModule } from 'ngx-markdown';
import { AppInitService } from './app-init/app-init.service';
import { ConfigService } from './app-init/config.service';
import { appRoutes } from './app.routes';
import * as customerEffects from './customers/state/customers.effects';
import { customerState } from './customers/state/customers.state';
import * as demoEffects from './demos/state/demos.effects';
import { demoState } from './demos/state/demos.state';
import { httpErrorInterceptor } from './error/http-error.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { authState } from './mock-auth/state/auth.state';
import { skillsDataServiceConfig } from './skills/skills-data.service.config';
import { skillsEntityConfig } from './skills/skills.metadata';
import { appState } from './state/app.state';
import { globalErrorHandler } from './error/error.handler';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(
            withInterceptors([
                authInterceptor,
                httpErrorInterceptor
            ])
        ),
        provideRouter(
            appRoutes,
            withComponentInputBinding(),
            withViewTransitions()
        ),
        provideAnimations(),
        provideZonelessChangeDetection(),
        importProvidersFrom(
            MarkdownModule.forRoot(),
        ),
        // NgRx
        provideStore(),
        provideState(appState),
        provideState(demoState),
        provideState(customerState),
        provideState(authState),
        provideEffects(demoEffects),
        provideEffects(customerEffects),
        // NgRx Data -> Skills
        provideEntityData(skillsEntityConfig, withEffects()),
        { provide: DefaultDataServiceConfig, useValue: skillsDataServiceConfig },
        //NgRx DevTools
        provideStoreDevtools({ maxAge: 25 }),
        // Application Init
        provideAppInitializer(() => console.log('App init running')),
        provideAppInitializer(() => inject(AppInitService).loadData()),
        provideAppInitializer(() => inject(ConfigService).loadConfig()),
        {
            provide: ErrorHandler,
            useValue: globalErrorHandler,
        },
    ]
};