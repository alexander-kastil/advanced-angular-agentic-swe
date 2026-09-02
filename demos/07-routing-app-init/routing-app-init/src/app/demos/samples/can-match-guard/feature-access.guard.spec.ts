import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Route, UrlSegment } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthFacade } from '../../../mock-auth/auth.facade';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { featureAccessGuard } from './feature-access.guard';

const route: Route = { path: 'prime-feature' };
const segments: UrlSegment[] = [];
const snapshot = { routeConfig: route } as unknown as ActivatedRouteSnapshot;

describe('featureAccessGuard', () => {
  const displayAlert = vi.fn();
  let auth: AuthFacade;

  beforeEach(() => {
    displayAlert.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: SnackbarService, useValue: { displayAlert } }],
    });
    auth = TestBed.inject(AuthFacade);
  });

  const run = () => TestBed.runInInjectionContext(() => featureAccessGuard(route, segments, snapshot));

  it('refuses to match the route for a non prime member', () => {
    expect(run()).toBe(false);
    expect(displayAlert).toHaveBeenCalledWith('No Access', 'The chunk is never downloaded');
  });

  it('matches the route for a prime member', () => {
    auth.togglePrimeMember();

    expect(run()).toBe(true);
    expect(displayAlert).not.toHaveBeenCalled();
  });

  it('ignores authentication and looks only at the prime flag', () => {
    auth.toggleLoggedIn();

    expect(run()).toBe(false);
  });
});
