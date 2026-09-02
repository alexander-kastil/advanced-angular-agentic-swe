import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideAnimations(),
        importProvidersFrom(
            MarkdownModule.forRoot(),
        ),
    ]
};
