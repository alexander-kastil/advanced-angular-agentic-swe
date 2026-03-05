# Routing & Security using NgRx

## Routing

### Routing and NgRx

Add Routing:

```
ng add @ngrx/router-store
```

## Security

### Configure SSL in Angular

- Execute `bash generate.sh` `create-certs\` in Git Bash to create certs.
- Copy `server.crt`and `server.key` to newly created `ssl` folder of Angular project.`
- Register in `angular.json`

```typescript
"serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
        "browserTarget": "HelloSSL:build",
        "ssl": true,
        "sslKey": "/ssl/server.key",
        "sslCert": "/ssl/server.crt"
    },
```

Get Chrome to trust self signed localhost:

```
chrome://flags/#allow-insecure-localhost
```

### Token based Authentication

[JSON Web Tokens - Jwt](https://jwt.io/)

[OpenID Connect](https://connect2id.com/learn/openid-connect)

### Angular Auth

[MSAL for JavaScript](https://github.com/AzureAD/microsoft-authentication-library-for-js)

[MSAL for Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)

[MSAL Excample](https://docs.microsoft.com/en-us/samples/azure-samples/active-directory-javascript-singlepageapp-angular/active-directory-javascript-singlepageapp-angular/)

### .NET Core Auth

[.NET Core Identity](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-2.2&tabs=visual-studio)

[.NET Core Authentication Snippets](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/social/microsoft-logins?view=aspnetcore-2.2)

### Could Accounts:

#### Firebase

[Firebase](https://firebase.google.com/)

#### Azure

[Azure Trial](https://azure.microsoft.com/en-us/free/)

[Azure Passes](https://www.microsoftazurepass.com/)
