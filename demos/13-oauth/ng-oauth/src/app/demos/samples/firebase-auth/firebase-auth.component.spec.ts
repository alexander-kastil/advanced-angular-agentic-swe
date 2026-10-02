import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FirebaseAuthComponent } from './firebase-auth.component';

describe('FirebaseAuthComponent', () => {
  it('switches between the snippets', () => {
    const component = TestBed.createComponent(FirebaseAuthComponent).componentInstance;

    component.select('api');

    expect(component.selected().code).toContain('securetoken.google.com');
  });
});
