import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthFacade } from './auth.facade';
import { authGuard } from './auth.guard';

const route = {} as ActivatedRouteSnapshot;
const state = {} as RouterStateSnapshot;

describe('authGuard', () => {
  const navigate = vi.fn();

  beforeEach(() => {
    navigate.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate } }],
    });
  });

  const run = () => TestBed.runInInjectionContext(() => authGuard(route, state));

  it('blocks an anonymous visitor and sends them to the sign in page', () => {
    expect(run()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('lets a signed in user through without navigating', () => {
    TestBed.inject(AuthFacade).setFakeUserAndToken('giro@example.com');

    expect(run()).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('blocks again after sign out', () => {
    const auth = TestBed.inject(AuthFacade);
    auth.setFakeUserAndToken('giro@example.com');
    auth.signOut();

    expect(run()).toBe(false);
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
