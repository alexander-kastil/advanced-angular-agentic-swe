---
name: msal-angular-appreg
description: >-
  Azure AD app registration management for MSAL Angular apps. Covers reading
  and updating SPA redirect URIs via Azure CLI and MS Graph, registering
  auth-redirect URIs for local dev and production, and diagnosing redirect_uri
  mismatch errors. Use when adding a new redirect URI, checking app registration
  state, or onboarding a new environment.
---

# MSAL Angular — App Registration Reference

> App registration in Azure AD (Entra ID) for SPA apps using MSAL Angular 22+ with PKCE auth code flow.

---

## Key Facts — vouchers-ai

| Property | Value |
|---|---|
| Client (App) ID | `54f03c51-f41a-4f1f-97ca-d219ee28ee50` |
| Tenant ID | `d92b247e-90e0-4469-a129-6a32866c0d0a` |
| Platform type | **SPA** (not Web) — uses PKCE auth code flow |
| Registered URIs | `http://localhost:4200`, `https://vouchersai.integrations.at/`, `https://zealous-bay-02ad9c603.7.azurestaticapps.net/` |

## Key Facts — ct-member-db (citythong-members)

| Property | Value |
|---|---|
| Client (App) ID | `1d56f072-e5c4-43e9-8ab4-e1974d40ac64` |
| Tenant ID | `d92b247e-90e0-4469-a129-6a32866c0d0a` |
| Scope | `api://1d56f072-e5c4-43e9-8ab4-e1974d40ac64/access_as_user` |
| Token version | v2 (`requestedAccessTokenVersion: 2`) — API `Audience` is the **bare GUID** |
| Registered SPA URIs | `http://localhost:4200`, `https://witty-flower-0126a6403.7.azurestaticapps.net` |
| WIF deploy app | `github-ct-member-db-deploy` — `7f411fcd-d0a7-434f-980d-1b1edac0bbd7` |

---

## Create a New App Registration from Scratch (single-app SPA + API)

One registration serves both the SPA and the protected API. Order matters: the scope must exist before it can be pre-authorized (two separate PATCH calls).

```bash
APP_ID=$(az ad app create --display-name "my-app" --sign-in-audience AzureADMyOrg --query appId -o tsv)
SCOPE_ID=$(python -c "import uuid; print(uuid.uuid4())")

az rest --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications(appId='$APP_ID')" \
  --headers "Content-Type=application/json" \
  --body "{
    \"identifierUris\": [\"api://$APP_ID\"],
    \"spa\": { \"redirectUris\": [\"http://localhost:4200\"] },
    \"api\": {
      \"requestedAccessTokenVersion\": 2,
      \"oauth2PermissionScopes\": [{
        \"id\": \"$SCOPE_ID\",
        \"adminConsentDescription\": \"Access the API as the signed-in user\",
        \"adminConsentDisplayName\": \"Access the API\",
        \"userConsentDescription\": \"Access the API as you\",
        \"userConsentDisplayName\": \"Access the API\",
        \"isEnabled\": true, \"type\": \"User\", \"value\": \"access_as_user\"
      }]
    }
  }"

az rest --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications(appId='$APP_ID')" \
  --headers "Content-Type=application/json" \
  --body "{ \"api\": { \"preAuthorizedApplications\": [{ \"appId\": \"$APP_ID\", \"delegatedPermissionIds\": [\"$SCOPE_ID\"] }] } }"

az ad sp create --id "$APP_ID"
```

Gotchas:

- `uuidgen` does not exist in git bash on Windows — use `python -c "import uuid; print(uuid.uuid4())"`. An empty `$SCOPE_ID` produces Graph errors `Cannot convert the literal '' to the expected type 'Edm.Guid'` and `Empty or null value specified in the 'delegatedPermissionIds' set`.
- Pre-authorizing the app for its own scope (second PATCH) skips the consent prompt entirely.
- `requestedAccessTokenVersion: 2` means the access token `aud` is the bare appId GUID — configure the API's `AzureAd:Audience` accordingly (an `api://GUID` audience causes `IDX10214`).
- Pass JSON bodies via a temp file (`--body @/tmp/body.json`) when quoting gets hairy in bash.

---

## View Current SPA Redirect URIs

```bash
az ad app show \
  --id 54f03c51-f41a-4f1f-97ca-d219ee28ee50 \
  --query "{spa:spa.redirectUris, web:web.redirectUris}" \
  -o json
```

---

## Add a SPA Redirect URI

Azure CLI has no `--spa-redirect-uris` flag. Use `az rest` to PATCH via MS Graph.
**Always include ALL existing URIs — this call replaces the full list.**

```bash
az rest \
  --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications(appId='54f03c51-f41a-4f1f-97ca-d219ee28ee50')" \
  --headers "Content-Type=application/json" \
  --body '{
    "spa": {
      "redirectUris": [
        "https://vouchersai.integrations.at/",
        "https://zealous-bay-02ad9c603.7.azurestaticapps.net/",
        "http://localhost:4200",
        "http://localhost:4200/NEW-URI-HERE"
      ]
    }
  }'
```

Verify after:

```bash
az ad app show \
  --id 54f03c51-f41a-4f1f-97ca-d219ee28ee50 \
  --query "spa.redirectUris" \
  -o json
```

---

## Platform Types: SPA vs Web

| Platform | Use for | Auth flow |
|---|---|---|
| **SPA** | MSAL Browser / Angular SPAs | PKCE auth code flow — tokens returned directly to browser |
| **Web** | Server-side apps, API callbacks | Auth code flow — tokens returned server-side |

MSAL Angular with `@azure/msal-browser` always uses the **SPA** platform. Adding a URI to **Web** instead will cause `redirect_uri_mismatch` errors at runtime.

---

## `redirectUri` in MSAL Config vs App Registration

The `redirectUri` in `MSALInstanceFactory` must **exactly match** one of the registered SPA URIs in Azure AD (including trailing slash).

```typescript
// environment.ts
redirectUri: '/',  // resolves to http://localhost:4200/

// Azure AD must have: "http://localhost:4200/" (WITH trailing slash)
// OR:                 "http://localhost:4200"  (WITHOUT — Azure is lenient about trailing slash)
```

If you see `AADSTS50011: The redirect URI ... does not match`, check:

1. Is the URI in the **SPA** section (not Web)?
2. Does the scheme, host, port, and path match exactly?
3. Is `http://` used for localhost (not `https://`)?

---

## Adding a New Environment (e.g., staging)

When deploying a new environment, add its origin to the SPA redirect URIs before deploying:

```bash
az rest \
  --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications(appId='54f03c51-f41a-4f1f-97ca-d219ee28ee50')" \
  --headers "Content-Type=application/json" \
  --body '{
    "spa": {
      "redirectUris": [
        "https://vouchersai.integrations.at/",
        "https://zealous-bay-02ad9c603.7.azurestaticapps.net/",
        "http://localhost:4200",
        "https://NEW-STAGING-URL.azurestaticapps.net/"
      ]
    }
  }'
```

---

## Login Required — Azure AD Consent Scopes

The app uses a custom API scope: `api://54f03c51-f41a-4f1f-97ca-d219ee28ee50/access_as_user`

This scope must be exposed in the **Expose an API** section of the app registration. If users see "Need admin approval" errors, the scope may not be pre-consented for the tenant.

---

## Related

- [`msal-angular.md`](msal-angular.md) — provider setup and auth service patterns
- [`angular-msal-auth.md`](angular-msal-auth.md) — MSAL overview and 401 triage
