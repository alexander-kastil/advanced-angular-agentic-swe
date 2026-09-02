import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthFacade } from '../../../mock-auth/auth.facade';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { onlyAuthenticatedGuard } from './only-authenticated.guard';
import { onlyPrimeMembersGuard } from './only-prime-members.guard';

const route = {} as ActivatedRouteSnapshot;
const state = {} as RouterStateSnapshot;

describe('multi guard chain', () => {
  const displayAlert = vi.fn();
  let auth: AuthFacade;

  beforeEach(() => {
    displayAlert.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: SnackbarService, useValue: { displayAlert } }],
    });
    auth = TestBed.inject(AuthFacade);
  });

  const authenticated = () => TestBed.runInInjectionContext(() => onlyAuthenticatedGuard(route, state));
  const prime = () => TestBed.runInInjectionContext(() => onlyPrimeMembersGuard(route, state));

  it('onlyAuthenticatedGuard rejects an anonymous visitor and explains why', () => {
    expect(authenticated()).toBe(false);
    expect(displayAlert).toHaveBeenCalledWith('No Access', 'Access only for authenticated users');
  });

  it('onlyAuthenticatedGuard accepts a signed in user silently', () => {
    auth.toggleLoggedIn();

    expect(authenticated()).toBe(true);
    expect(displayAlert).not.toHaveBeenCalled();
  });

  it('onlyPrimeMembersGuard rejects a signed in user without a prime membership', () => {
    auth.toggleLoggedIn();

    expect(prime()).toBe(false);
    expect(displayAlert).toHaveBeenCalledWith('No Access', 'Access only for prime members');
  });

  it('passes both guards only when the user is signed in and prime', () => {
    auth.toggleLoggedIn();
    auth.togglePrimeMember();

    expect(authenticated()).toBe(true);
    expect(prime()).toBe(true);
    expect(displayAlert).not.toHaveBeenCalled();
  });

  it('stops at the first guard for a prime member who is not signed in', () => {
    auth.togglePrimeMember();

    expect(authenticated()).toBe(false);
    expect(displayAlert).toHaveBeenCalledTimes(1);
  });
});
