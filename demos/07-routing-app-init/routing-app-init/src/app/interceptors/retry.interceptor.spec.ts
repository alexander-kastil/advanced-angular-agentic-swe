import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
import { httpErrorInterceptor } from '../error/http-error.interceptor';
import { authInterceptor } from './auth.interceptor';
import { retryInterceptor } from './retry.interceptor';

const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

const setup = (interceptors: Parameters<typeof withInterceptors>[0]) => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(withInterceptors(interceptors)), provideHttpClientTesting()],
  });

  return {
    http: TestBed.inject(HttpClient),
    ctrl: TestBed.inject(HttpTestingController),
  };
};

describe('retryInterceptor', () => {
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('resubscribes until the request succeeds', async () => {
    const { http, ctrl } = setup([retryInterceptor({ count: 3, delay: 0 })]);
    const result = firstValueFrom(http.get<{ ok: boolean }>('/flaky'));

    ctrl.expectOne('/flaky').flush('boom', { status: 500, statusText: 'Server Error' });
    await tick();
    ctrl.expectOne('/flaky').flush('boom', { status: 500, statusText: 'Server Error' });
    await tick();
    ctrl.expectOne('/flaky').flush({ ok: true });

    expect(await result).toEqual({ ok: true });
  });

  it('gives up after the configured count and surfaces the error', async () => {
    const { http, ctrl } = setup([retryInterceptor({ count: 1, delay: 0 })]);
    let status = 0;
    http.get('/always-down').subscribe({ error: (err) => (status = err.status) });

    ctrl.expectOne('/always-down').flush('boom', { status: 503, statusText: 'Unavailable' });
    await tick();
    ctrl.expectOne('/always-down').flush('boom', { status: 503, statusText: 'Unavailable' });
    await tick();

    expect(status).toBe(503);
  });

  it('passes a successful request through without a second attempt', () => {
    const { http, ctrl } = setup([retryInterceptor({ count: 3, delay: 0 })]);
    http.get('/stable').subscribe();

    ctrl.expectOne('/stable').flush({});
    ctrl.expectNone('/stable');
  });

  it('retries inside the chain app.config registers, then hands the failure to the error interceptor', async () => {
    const { http, ctrl } = setup([
      authInterceptor,
      retryInterceptor({ count: 2, delay: 0 }),
      httpErrorInterceptor,
    ]);
    let message = '';
    http.get('/chained').subscribe({ error: (err: Error) => (message = err.message) });

    for (let attempt = 0; attempt < 3; attempt++) {
      ctrl.expectOne('/chained').flush('boom', { status: 500, statusText: 'Server Error' });
      await tick();
    }

    expect(message).toContain('/chained');
  });
});
