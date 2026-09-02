import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  injectAsync,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  NavigationError,
  RedirectCommand,
  Router,
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withNavigationErrorHandler,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { AppInitService } from './app-init/app-init.service';
import { ConfigService } from './app-init/config.service';
import { appRoutes } from './app.routes';
import { StartupLogService } from './demos/samples/app-initializer-async/startup-log.service';
import { SelectivePreloadingStrategy } from './demos/samples/preloading-strategy/selective-preloading.strategy';
import { ErrorLogService } from './error/error-log.service';
import { GlobalErrorHandler } from './error/error.handler';
import { httpErrorInterceptor } from './error/http-error.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { retryInterceptor } from './interceptors/retry.interceptor';
import { loadingInterceptor } from './shared/loading/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        authInterceptor,
        retryInterceptor({ count: 3, delay: 1000 }),
        httpErrorInterceptor,
      ])
    ),
    provideRouter(
      appRoutes,
      withComponentInputBinding({ queryParams: true, unmatchedInputBehavior: 'alwaysUndefined' }),
      withViewTransitions(),
      withPreloading(SelectivePreloadingStrategy),
      withExperimentalAutoCleanupInjectors(),
      withNavigationErrorHandler((error: NavigationError) => {
        inject(ErrorLogService).record('NavigationError', error.error?.message ?? String(error.error));
        return new RedirectCommand(inject(Router).parseUrl('/demos/navigation-errors'));
      })
    ),
    provideZonelessChangeDetection(),
    importProvidersFrom(MarkdownModule.forRoot()),
    provideAppInitializer(() => console.log('App init running')),
    provideAppInitializer(() => inject(AppInitService).loadData()),
    provideAppInitializer(() => inject(ConfigService).loadConfig()),
    provideAppInitializer(async () => {
      const log = inject(StartupLogService);
      const loadFlags = injectAsync(() =>
        import('./demos/samples/app-initializer-async/remote-flags.service').then(
          (m) => m.RemoteFlagsService
        )
      );

      log.record('initializer started, requesting the lazy flags service');
      const flags = await loadFlags();
      await flags.load();
      log.record(`flags resolved: ${flags.enabled().join(', ')}`);
    }),
    {
      provide: ErrorHandler,
      useExisting: GlobalErrorHandler,
    },
  ],
};
