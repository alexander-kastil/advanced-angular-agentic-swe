import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MERMAID_OPTIONS, provideMarkdown } from 'ngx-markdown';
import mermaid from 'mermaid';
import { appRoutes } from './app.routes';
import { loadingInterceptor } from './shared/loading/loading-interceptor';

(window as any).mermaid = mermaid;
mermaid.initialize({ startOnLoad: false, theme: 'dark' });

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideAnimationsAsync(),
        provideMarkdown({
            mermaidOptions: {
                provide: MERMAID_OPTIONS,
                useValue: {
                    darkMode: true,
                    theme: 'base',
                },
            },
        }),
        // Application Init
        provideAppInitializer(() => { console.log('App init running'); })
    ]
};