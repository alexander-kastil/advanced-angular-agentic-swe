import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { MarkdownModule } from 'ngx-markdown';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { provideEntityData, withEffects, DefaultDataServiceConfig } from '@ngrx/data';
import { skillsDataServiceConfig } from './skills/skills-data.service.config';
import { skillsEntityConfig } from './skills/skills.metadata';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
    providers: [
        [
            provideHttpClient(),
            provideAnimations(),
            provideRouter(appRoutes, withComponentInputBinding()),
            importProvidersFrom(
                MarkdownModule.forRoot(),
                LoggerModule.forRoot({
                    serverLoggingUrl: 'http://localhost:3000/logs',
                    level: NgxLoggerLevel.DEBUG,
                    serverLogLevel: NgxLoggerLevel.ERROR
                }),
            ),
            // NgRx base used for skills
            provideStore(),
            provideEffects(),
            // NgRx Data -> Skills
            provideEntityData(skillsEntityConfig, withEffects()),
            { provide: DefaultDataServiceConfig, useValue: skillsDataServiceConfig },
            // Redux DevTools
            provideStoreDevtools({ maxAge: 25 }),
        ]
    ]
};   