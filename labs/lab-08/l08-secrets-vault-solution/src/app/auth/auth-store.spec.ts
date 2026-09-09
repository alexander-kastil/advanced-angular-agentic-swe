import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthStore } from './auth-store';

describe('AuthStore', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  it('stores the session and reports the roles after a sign in', async () => {
    const auth = TestBed.inject(AuthStore);
    expect(auth.isSignedIn()).toBe(false);

    const signingIn = auth.signIn('owner', 'Owner#Vault2026!');
    const request = http.expectOne('/api/auth/login');
    expect(request.request.body).toEqual({ name: 'owner', password: 'Owner#Vault2026!' });
    request.flush({ token: 'jwt-token', name: 'owner', roles: ['Owner'] });
    await signingIn;

    expect(auth.isSignedIn()).toBe(true);
    expect(auth.user()).toBe('owner');
    expect(auth.roles()).toEqual(['Owner']);
    expect(auth.token()).toBe('jwt-token');
  });

  it('restores a session written by an earlier visit', () => {
    localStorage.setItem(
      'secrets-vault-session',
      JSON.stringify({ token: 'jwt-token', name: 'customer', roles: ['Customer'] }),
    );

    const auth = TestBed.inject(AuthStore);
    auth.restore();

    expect(auth.user()).toBe('customer');
  });

  it('clears the session on sign out', () => {
    localStorage.setItem(
      'secrets-vault-session',
      JSON.stringify({ token: 'jwt-token', name: 'owner', roles: ['Owner'] }),
    );

    const auth = TestBed.inject(AuthStore);
    auth.restore();
    auth.signOut();

    expect(auth.isSignedIn()).toBe(false);
    expect(localStorage.getItem('secrets-vault-session')).toBeNull();
  });
});
