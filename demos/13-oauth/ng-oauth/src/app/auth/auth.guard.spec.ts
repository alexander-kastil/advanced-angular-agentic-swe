import { TestBed } from '@angular/core/testing';
import { CanMatchFn, provideRouter, Router, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthStore } from './auth.store';

describe('authGuard', () => {
  const run = () => TestBed.runInInjectionContext(() => authGuard({}, [], {} as Parameters<CanMatchFn>[2]));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('redirects to the login page when nobody is signed in', () => {
    const result = run() as UrlTree;

    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/demos/app-auth-flow');
  });

  it('lets an authenticated user through', () => {
    TestBed.inject(AuthStore).login('Ada Lovelace');

    expect(run()).toBe(true);
  });
});
