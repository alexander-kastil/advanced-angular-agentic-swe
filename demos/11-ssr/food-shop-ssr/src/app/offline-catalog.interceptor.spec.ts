import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OFFLINE_CATALOG_HEADER, offlineCatalogInterceptor } from './offline-catalog.interceptor';
import { FALLBACK_FOOD } from './food/food.data';
import { FALLBACK_DEMOS } from './demos/demo-container/demo.data';

describe('offlineCatalogInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([offlineCatalogInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  it('serves the bundled food catalog when the api is down', async () => {
    const response = http.get('http://localhost:3010/food', { observe: 'response' });
    const promise = new Promise<unknown>((resolve) => response.subscribe(resolve));

    controller
      .expectOne('http://localhost:3010/food')
      .error(new ProgressEvent('error'), { status: 0 });

    const result = (await promise) as { body: unknown; headers: { has(name: string): boolean } };
    expect(result.body).toEqual(FALLBACK_FOOD);
    expect(result.headers.has(OFFLINE_CATALOG_HEADER)).toBe(true);
  });

  it('serves the bundled demo catalog when the api is down', async () => {
    const promise = new Promise<unknown>((resolve) =>
      http.get('http://localhost:3010/demos').subscribe(resolve)
    );

    controller
      .expectOne('http://localhost:3010/demos')
      .error(new ProgressEvent('error'), { status: 0 });

    expect(await promise).toEqual(FALLBACK_DEMOS);
  });

  it('answers an unknown dish with null instead of an error', async () => {
    const promise = new Promise<unknown>((resolve) =>
      http.get('http://localhost:3010/food/99').subscribe(resolve)
    );

    controller
      .expectOne('http://localhost:3010/food/99')
      .error(new ProgressEvent('error'), { status: 404 });

    expect(await promise).toBeNull();
  });

  it('rethrows for a url it has no fallback for', async () => {
    const promise = new Promise<unknown>((resolve) =>
      http.get('http://localhost:3010/orders').subscribe({ error: resolve })
    );

    controller
      .expectOne('http://localhost:3010/orders')
      .error(new ProgressEvent('error'), { status: 500 });

    expect(await promise).toBeTruthy();
  });
});
