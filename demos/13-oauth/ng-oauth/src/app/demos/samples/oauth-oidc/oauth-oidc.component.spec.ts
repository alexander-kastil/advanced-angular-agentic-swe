import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { createChallenge } from '../../../auth/pkce';
import { OauthOidcComponent } from './oauth-oidc.component';

describe('OauthOidcComponent', () => {
  it('derives the S256 challenge from RFC 7636 appendix B', async () => {
    const challenge = await createChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk');

    expect(challenge).toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
  });

  it('builds an authorize url that carries the challenge', async () => {
    const component = TestBed.createComponent(OauthOidcComponent).componentInstance;
    await component.generate();

    expect(component.verifier()).toHaveLength(43);
    expect(component.authorizeUrl()).toContain(`code_challenge=${component.challenge()}`);
    expect(component.authorizeUrl()).toContain('code_challenge_method=S256');
  });
});
