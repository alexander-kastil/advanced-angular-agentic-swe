import { describe, expect, it } from 'vitest';
import { matchResource } from './entra-msal.component';

describe('matchResource', () => {
  it('matches a wildcard api entry', () => {
    expect(matchResource('https://localhost:5001/api/food/3')?.[1]).toEqual([
      'api://<api-client-id>/access_as_user'
    ]);
  });

  it('matches graph exactly', () => {
    expect(matchResource('https://graph.microsoft.com/v1.0/me')?.[1]).toEqual(['user.read']);
  });

  it('leaves other hosts alone', () => {
    expect(matchResource('https://cdn.example.com/app.js')).toBeNull();
  });
});
