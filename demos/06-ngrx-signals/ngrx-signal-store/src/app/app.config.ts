import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { DefaultDataServiceConfig, provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MERMAID_OPTIONS, provideMarkdown } from 'ngx-markdown';
import mermaid from 'mermaid';
import { appRoutes } from './app.routes';
import { loadingInterceptor } from './shared/loading/loading-interceptor';

import { skillsDataServiceConfig } from './skills/skills-data.service.config';
import { skillsEntityConfig } from './skills/skills.metadata';

// Initialize mermaid globally
(window as any).mermaid = mermaid;
mermaid.initialize({ startOnLoad: false, theme: 'dark' });

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideAnimations(),
        //NgRx
        provideStore(),
        provideEffects(),
        // NgRx Data
        provideEntityData(skillsEntityConfig, withEffects()),
        { provide: DefaultDataServiceConfig, useValue: skillsDataServiceConfig },
        // NgRx DevTools
        provideStoreDevtools({ maxAge: 25 }),
        provideMarkdown({
            mermaidOptions: {
                provide: MERMAID_OPTIONS,
                useValue: {
                    darkMode: true,
                    theme: 'base',
                },
            },
        }),
    ]
};