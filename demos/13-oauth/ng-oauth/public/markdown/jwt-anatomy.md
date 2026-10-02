# Reading a JWT

A JSON Web Token is `header.payload.signature`, each segment base64url encoded. The header names the
signing algorithm and key, the payload carries the claims, and the signature lets the API prove
the issuer wrote both. Decoding needs no key; verifying does.

## Decode it yourself

The helper in `src/app/auth/jwt.ts` is all the code a browser needs to read a token:

```typescript
export function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeJwt(token: string): DecodedJwt {
  const [header, payload, signature] = token.trim().split('.');
  return {
    header: JSON.parse(base64UrlDecode(header)),
    payload: JSON.parse(base64UrlDecode(payload)),
    signature
  };
}
```

`TextDecoder` matters: a name like "Jürgen" is UTF-8 in the payload, and `atob()` alone returns
mojibake.

## Run the demo

1. Open **Reading a JWT**. It loads a token shaped like an Entra ID v2 access token.
2. Read the claims table: `aud` names the API, `scp` the delegated scope, `roles` the app roles.
3. Click **Expired token** and watch the status turn red.
4. Paste a real access token from your browser's Network tab. Nothing is sent anywhere.

Expected result: the three segments coloured separately, the decoded header and payload, and an
expiry countdown.

## Claims an API validates

| Claim | Check |
| --- | --- |
| `iss` | Equals the issuer of your tenant or project |
| `aud` | Equals your API's client id or `api://` URI |
| `exp` / `nbf` | The current time lies between them, with a small clock skew |
| signature | Verifies against a key from the issuer's JWKS endpoint |
| `scp` or `roles` | Contains the permission the endpoint requires |

The demo tokens use `alg: none` and an empty signature, which is how this module mints tokens
without a key. ASP.NET Core's JWT bearer handler rejects unsigned tokens by default, and so must
every API you write.

## What the browser may do with claims

Read them for display: the user's name, the expiry time for a countdown, a role to hide a button.
Never use them as the security boundary. Anyone can edit a payload in DevTools, and only the API,
which verifies the signature, is allowed to believe it.

## Links

- [RFC 7519: JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519)
- [Microsoft identity platform access token claims](https://learn.microsoft.com/en-us/entra/identity-platform/access-token-claims-reference)
