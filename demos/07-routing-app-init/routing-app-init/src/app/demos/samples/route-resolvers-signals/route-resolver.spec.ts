import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Album, albumResolver } from './route-resolver';

const state = {} as RouterStateSnapshot;

const snapshotFor = (params: Record<string, string>) =>
  ({ paramMap: convertToParamMap(params) }) as unknown as ActivatedRouteSnapshot;

describe('albumResolver', () => {
  let ctrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    ctrl.verify();
  });

  const run = (params: Record<string, string>) =>
    TestBed.runInInjectionContext(
      () => albumResolver(snapshotFor(params), state) as Observable<Album>
    );

  it('requests the album named by the id route parameter', () => {
    let resolved: Album | undefined;
    run({ id: '7' }).subscribe((album) => (resolved = album));

    const req = ctrl.expectOne('https://jsonplaceholder.typicode.com/albums/7');
    expect(req.request.method).toBe('GET');
    req.flush({ userId: 1, id: 7, title: 'quidem molestiae enim' });

    expect(resolved).toEqual({ userId: 1, id: 7, title: 'quidem molestiae enim' });
  });

  it('falls back to album 1 when the segment carries no id', () => {
    run({}).subscribe();

    ctrl.expectOne('https://jsonplaceholder.typicode.com/albums/1').flush({
      userId: 1,
      id: 1,
      title: 'first',
    });
  });

  it('surfaces a failed lookup to the router instead of swallowing it', () => {
    let status = 0;
    run({ id: '9999' }).subscribe({ error: (err) => (status = err.status) });

    ctrl
      .expectOne('https://jsonplaceholder.typicode.com/albums/9999')
      .flush('not found', { status: 404, statusText: 'Not Found' });

    expect(status).toBe(404);
  });
});
