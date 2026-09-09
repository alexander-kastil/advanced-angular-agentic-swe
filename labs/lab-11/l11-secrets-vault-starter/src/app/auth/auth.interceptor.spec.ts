import { describe, expect, it, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthStore } from './auth-store';

describe('authInterceptor', () => {
  let http: HttpTestingController;
  let client: HttpClient;
  let auth: AuthStore;

  beforeEach(() => {
    localStorage.setItem(
      'secrets-vault-session',
      JSON.stringify({ token: 'jwt-token', name: 'owner', roles: ['Owner'] }),
    );

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    auth = TestBed.inject(AuthStore);
    auth.restore();
  });

  it('adds the bearer token to an api call', () => {
    client.get('/api/lists').subscribe();
    const request = http.expectOne('/api/lists');

    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush([]);
  });

  it('leaves the login call unsigned', () => {
    client.post('/api/auth/login', {}).subscribe();
    const request = http.expectOne('/api/auth/login');

    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('signs out and routes to login on a 401', async () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const failing = firstValueFrom(client.get('/api/lists')).catch(() => 'rejected');

    http.expectOne('/api/lists').flush('nope', { status: 401, statusText: 'Unauthorized' });
    await failing;

    expect(auth.isSignedIn()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
