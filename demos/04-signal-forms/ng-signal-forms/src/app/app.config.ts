import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MERMAID_OPTIONS, provideMarkdown } from 'ngx-markdown';
import mermaid from 'mermaid';
import { routes } from './app.routes';
import { loadingInterceptor } from './shared/loading/loading-interceptor';

(window as any).mermaid = mermaid;
mermaid.initialize({ startOnLoad: false, theme: 'dark' });

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideRouter(routes, withComponentInputBinding()),
        provideAnimations(),
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
