import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { JwtAnatomyComponent } from './jwt-anatomy.component';

describe('JwtAnatomyComponent', () => {
  it('decodes the claims of the sample token', () => {
    const component = TestBed.createComponent(JwtAnatomyComponent).componentInstance;

    const names = component.claims().map((claim) => claim.name);

    expect(names).toContain('aud');
    expect(names).toContain('scp');
    expect(component.valid()).toBe(true);
  });

  it('reports an expired token', () => {
    const component = TestBed.createComponent(JwtAnatomyComponent).componentInstance;

    component.useExpired();

    expect(component.expiry()).toContain('Expired');
  });

  it('explains a malformed token instead of throwing', () => {
    const component = TestBed.createComponent(JwtAnatomyComponent).componentInstance;

    component.setToken('not-a-jwt');

    expect(component.decoded().error).toContain('three');
  });
});
