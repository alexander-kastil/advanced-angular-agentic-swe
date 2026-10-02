import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { AuthStore } from '../../../../auth/auth.store';
import { ProtectedAreaComponent } from './protected-area.component';

describe('ProtectedAreaComponent', () => {
  it('greets the signed-in user', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    TestBed.inject(AuthStore).login('Ada Lovelace');
    const fixture = TestBed.createComponent(ProtectedAreaComponent);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Ada Lovelace');
  });
});
