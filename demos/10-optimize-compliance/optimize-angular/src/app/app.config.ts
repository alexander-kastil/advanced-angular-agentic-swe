import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { MERMAID_OPTIONS, provideMarkdown } from 'ngx-markdown';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import mermaid from 'mermaid';
import { loadingInterceptor } from './shared/loading/loading-interceptor';


(globalThis as unknown as { mermaid: typeof mermaid }).mermaid = mermaid;
mermaid.initialize({ startOnLoad: false, theme: 'dark' });

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideAnimations(),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideMarkdown({
            mermaidOptions: {
                provide: MERMAID_OPTIONS,
                useValue: {
                    darkMode: true,
                    theme: 'base',
                },
            },
        }),
        importProvidersFrom(
            LoggerModule.forRoot({
                serverLoggingUrl: 'http://localhost:3000/logs',
                level: NgxLoggerLevel.DEBUG,
                serverLogLevel: NgxLoggerLevel.ERROR
            }),
        ),
    ]
};   