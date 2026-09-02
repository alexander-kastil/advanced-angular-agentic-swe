import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../environments/environment';
import { AuthFacade, fakeToken } from '../mock-auth/auth.facade';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let auth: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });

    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthFacade);
  });

  afterEach(() => {
    ctrl.verify();
  });

  it('leaves an anonymous request untouched', () => {
    http.get('https://api.example.com/albums').subscribe();

    const req = ctrl.expectOne('https://api.example.com/albums');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('adds a bearer header once a user is signed in', () => {
    auth.setFakeUserAndToken('giro@example.com');
    http.get('https://api.example.com/albums').subscribe();

    const req = ctrl.expectOne('https://api.example.com/albums');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    req.flush({});
  });

  it('sends the token as a string, not a stringified Observable', () => {
    auth.setFakeUserAndToken('giro@example.com');
    http.get('https://api.example.com/albums').subscribe();

    const req = ctrl.expectOne('https://api.example.com/albums');
    const header = req.request.headers.get('Authorization') ?? '';
    expect(header).not.toContain('[object Object]');
    expect(header.split(' ')[1]).toBe(fakeToken);
    req.flush({});
  });

  it('skips the local json-server api even for a signed in user', () => {
    auth.setFakeUserAndToken('giro@example.com');
    const url = `${environment.api}demos`;
    http.get(url).subscribe();

    const req = ctrl.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('drops the header again after sign out', () => {
    auth.setFakeUserAndToken('giro@example.com');
    auth.signOut();
    http.get('https://api.example.com/albums').subscribe();

    const req = ctrl.expectOne('https://api.example.com/albums');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('does not clone the request when there is nothing to add', () => {
    http.get('https://api.example.com/albums').subscribe();

    const req = ctrl.expectOne('https://api.example.com/albums');
    expect(req.request.headers.keys()).toEqual([]);
    req.flush({});
  });
});
