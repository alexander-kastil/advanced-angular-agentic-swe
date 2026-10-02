import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../../auth/auth.store';

describe('AuthStore', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('derives the user from the token', () => {
    const store = TestBed.inject(AuthStore);

    store.login('Ada Lovelace', 30);

    expect(store.isAuthenticated()).toBe(true);
    expect(store.userName()).toBe('Ada Lovelace');
  });

  it('signs the user out when the token expires', () => {
    const store = TestBed.inject(AuthStore);
    store.login('Ada Lovelace', 2);

    vi.advanceTimersByTime(3000);

    expect(store.isAuthenticated()).toBe(false);
  });
});
