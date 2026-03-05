import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore, provideState } from '@ngrx/store';
import { MarkdownModule } from 'ngx-markdown';
import { customerState } from './customers/state/customers.state';
import { appState } from './state/app.state';
import { provideEntityData, withEffects, DefaultDataServiceConfig } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { skillsDataServiceConfig } from './skills/skills-data.service.config';
import { skillsEntityConfig } from './skills/skills.metadata';
import * as customerEffects from './customers/state/customers.effects';

export const appConfig: ApplicationConfig = {
    providers: [
        // provideZoneChangeDetection({ eventCoalescing: true }),
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideAnimations(),
        importProvidersFrom(
            MarkdownModule.forRoot(),
        ),
        // NgRx
        provideStore(),
        provideState(appState),
        provideState(customerState),
        provideEffects(customerEffects),
        // NgRx Data -> Skills
        provideEntityData(skillsEntityConfig, withEffects()),
        { provide: DefaultDataServiceConfig, useValue: skillsDataServiceConfig },
    ]
};