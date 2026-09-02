import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationInitStatus, inject, injectAsync, provideAppInitializer } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StartupLogService } from '../demos/samples/app-initializer-async/startup-log.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { AppConfig } from './app.config.model';
import { ConfigService } from './config.service';

describe('provideAppInitializer', () => {
  const displayAlert = vi.fn();

  beforeEach(() => {
    displayAlert.mockReset();
  });

  it('runs every initializer in registration order before donePromise settles', async () => {
    const order: string[] = [];

    TestBed.configureTestingModule({
      providers: [
        provideAppInitializer(() => { order.push('first'); }),
        provideAppInitializer(() => { order.push('second'); }),
        provideAppInitializer(() => { order.push('third'); }),
      ],
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(order).toEqual(['first', 'second', 'third']);
  });

  it('runs in an injection context so the initializer can use inject()', async () => {
    TestBed.configureTestingModule({
      providers: [provideAppInitializer(() => { inject(StartupLogService).record('booted'); })],
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(TestBed.inject(StartupLogService).entries().map((e) => e.message)).toEqual(['booted']);
  });

  it('awaits an async initializer that loads a lazily imported service with injectAsync', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAppInitializer(async () => {
          const log = inject(StartupLogService);
          const loadFlags = injectAsync(() =>
            import('../demos/samples/app-initializer-async/remote-flags.service').then(
              (m) => m.RemoteFlagsService
            )
          );

          log.record('initializer started');
          const flags = await loadFlags();
          await flags.load();
          log.record(`flags resolved: ${flags.enabled().join(', ')}`);
        }),
      ],
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;

    const messages = TestBed.inject(StartupLogService).entries().map((e) => e.message);
    expect(messages[0]).toBe('initializer started');
    expect(messages[1]).toContain('route-inputs');
  });

  it('fills the ConfigService signal from assets/config.json before the app starts', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SnackbarService, useValue: { displayAlert } },
        provideAppInitializer(() => inject(ConfigService).loadConfig()),
      ],
    });

    const status = TestBed.inject(ApplicationInitStatus);
    const ctrl = TestBed.inject(HttpTestingController);

    ctrl.expectOne('assets/config.json').flush({
      authEnabled: true,
      title: 'From config.json',
      markdownPath: 'markdown/',
      apiUrl: 'http://localhost:3000/',
    } satisfies AppConfig);

    await status.donePromise;

    expect(TestBed.inject(ConfigService).config().title).toBe('From config.json');
    expect(displayAlert).not.toHaveBeenCalled();
    ctrl.verify();
  });

  it('keeps the default config and alerts when config.json is missing', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SnackbarService, useValue: { displayAlert } },
        provideAppInitializer(() => inject(ConfigService).loadConfig()),
      ],
    });

    const status = TestBed.inject(ApplicationInitStatus);
    const ctrl = TestBed.inject(HttpTestingController);

    ctrl
      .expectOne('assets/config.json')
      .flush('missing', { status: 404, statusText: 'Not Found' });

    await status.donePromise;

    expect(TestBed.inject(ConfigService).config().title).toBe(new AppConfig().title);
    expect(displayAlert).toHaveBeenCalledWith('Startup Err', 'config.json not found');
    ctrl.verify();
  });
});
