import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { brokenResolver } from './broken.resolver';

const state = {} as RouterStateSnapshot;

const snapshotFor = (path: string) =>
  ({ routeConfig: { path } }) as unknown as ActivatedRouteSnapshot;

describe('brokenResolver', () => {
  it('throws so the navigation fails and withNavigationErrorHandler can react', () => {
    TestBed.configureTestingModule({});

    expect(() =>
      TestBed.runInInjectionContext(() => brokenResolver(snapshotFor('broken'), state))
    ).toThrowError('Resolver failed for segment "broken"');
  });

  it('names the segment it was configured on', () => {
    TestBed.configureTestingModule({});

    expect(() =>
      TestBed.runInInjectionContext(() => brokenResolver(snapshotFor('reports'), state))
    ).toThrowError(/"reports"/);
  });
});
