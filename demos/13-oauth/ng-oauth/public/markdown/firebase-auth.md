# Firebase Authentication

Firebase Authentication is a hosted identity provider with email and password, Google, GitHub,
Microsoft and others behind one SDK. It is the fastest way to put real sign-in in front of a demo
or a side project, and its ID token is a standard JWT your API validates like any other.

## Register the app

1. In the [Firebase console](https://console.firebase.google.com/), create a project such as
   `food-app-<initials>`.
2. Add a web app to the project and copy the `firebaseConfig` object it shows.
3. Under **Build > Authentication > Sign-in method**, enable **Email/Password**.

The `apiKey` in that config identifies the project to Google; it is not a secret and ships in the
bundle. What protects data is the ID token and the API that checks it.

## Wrap the SDK in signals

The modular SDK exposes functions, not classes. `onAuthStateChanged` fires on sign-in, sign-out and
on startup once the persisted session is restored, so it is the one place that writes the user
signal:

```typescript
@Service()
export class FirebaseAuthService {
  private readonly auth = getAuth(initializeApp(environment.firebaseConfig));

  readonly user = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => this.user.set(user));
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  idToken(): Promise<string | null> {
    return this.user()?.getIdToken() ?? Promise.resolve(null);
  }
}
```

## Attach the ID token

`getIdToken()` returns a promise and refreshes the token shortly before it expires, so the
interceptor converts it with `from()` and never handles refresh itself:

```typescript
export const firebaseAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.api)) {
    return next(req);
  }
  const auth = inject(FirebaseAuthService);
  return from(auth.idToken()).pipe(
    switchMap((token) =>
      next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req)
    )
  );
};
```

## Validate it in ASP.NET Core

A Firebase ID token is issued by `https://securetoken.google.com/<project-id>` with the project id
as audience. The JWT bearer handler fetches the signing keys from the issuer's metadata:

```csharp
var projectId = builder.Configuration["FirebaseProjectId"];

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = $"https://securetoken.google.com/{projectId}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/{projectId}",
            ValidateAudience = true,
            ValidAudience = projectId,
            ValidateLifetime = true
        };
    });
```

## Publish to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
ng build
firebase deploy --only hosting
```

`firebase init hosting` asks for the public directory: answer `dist/<project>/browser` and say yes
to rewriting all URLs to `index.html` so deep links reach the Angular router.

## Run the demo

Open **Firebase Authentication** and step through the five tabs. The demo shows the code only;
running it needs your own Firebase project.

## Links

- [Firebase Authentication for the web](https://firebase.google.com/docs/auth/web/start)
- [Verify ID tokens with a third-party JWT library](https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library)
