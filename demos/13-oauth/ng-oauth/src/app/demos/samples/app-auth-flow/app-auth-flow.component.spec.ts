import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../../auth/auth.store';
import { AppAuthFlowComponent } from './app-auth-flow.component';

describe('AppAuthFlowComponent', () => {
  it('returns the user to the page the guard refused', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    TestBed.inject(AuthStore).rememberReturnUrl('/demos/protected-area');
    const component = TestBed.createComponent(AppAuthFlowComponent).componentInstance;

    await component.login();

    expect(navigate).toHaveBeenCalledWith('/demos/protected-area');
    expect(TestBed.inject(AuthStore).returnUrl()).toBeNull();
  });
});
