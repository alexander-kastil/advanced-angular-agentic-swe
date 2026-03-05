import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { MarkdownModule } from 'ngx-markdown';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

export const appConfig: ApplicationConfig = {
    providers: [
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
    ]
};   