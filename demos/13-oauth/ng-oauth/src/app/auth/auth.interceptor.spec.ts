import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { AuthStore } from './auth.store';

describe('authInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    TestBed.inject(AuthStore).login('Ada Lovelace');
  });

  it('attaches the bearer token to a protected api', () => {
    http.get('https://api.ng-oauth.demo/orders').subscribe();

    const req = backend.expectOne('https://api.ng-oauth.demo/orders');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
  });

  it('never sends the token to a third party', () => {
    http.get('https://cdn.thirdparty.demo/fonts.json').subscribe();

    const req = backend.expectOne('https://cdn.thirdparty.demo/fonts.json');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });
});
