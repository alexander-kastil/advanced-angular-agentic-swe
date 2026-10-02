import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { AuthStore } from '../../../auth/auth.store';
import { AuthGuardComponent } from './auth-guard.component';

describe('AuthGuardComponent', () => {
  it('reflects the guard decision for the current user', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AuthGuardComponent);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('returns a UrlTree');

    TestBed.inject(AuthStore).login('Ada Lovelace');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('returns true');
  });
});
