import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface Snippet {
  key: string;
  label: string;
  code: string;
}

@Component({
  selector: 'app-firebase-auth',
  templateUrl: './firebase-auth.component.html',
  styleUrl: './firebase-auth.component.scss',
  imports: [CodeBlockComponent]
})
export class FirebaseAuthComponent {
  readonly snippets: Snippet[] = [
    {
      key: 'config',
      label: 'environment.ts',
      code: `export const environment = {
  authEnabled: true,
  api: 'https://localhost:5001/',
  firebaseConfig: {
    apiKey: '<web api key>',
    authDomain: '<project-id>.firebaseapp.com',
    projectId: '<project-id>',
    appId: '<app id>'
  }
};`
    },
    {
      key: 'service',
      label: 'firebase-auth.service.ts',
      code: `import { computed, Service, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, signOut, User
} from 'firebase/auth';

@Service()
export class FirebaseAuthService {
  private readonly auth = getAuth(initializeApp(environment.firebaseConfig));

  readonly user = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => this.user.set(user));
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  idToken(): Promise<string | null> {
    return this.user()?.getIdToken() ?? Promise.resolve(null);
  }
}`
    },
    {
      key: 'interceptor',
      label: 'firebase-auth.interceptor.ts',
      code: `export const firebaseAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.api)) {
    return next(req);
  }
  const auth = inject(FirebaseAuthService);
  return from(auth.idToken()).pipe(
    switchMap((token) =>
      next(token ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } }) : req)
    )
  );
};`
    },
    {
      key: 'api',
      label: 'Program.cs',
      code: `var projectId = builder.Configuration["FirebaseProjectId"];

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
    });`
    },
    {
      key: 'publish',
      label: 'Publish',
      code: `npm install -g firebase-tools
firebase login
firebase init hosting
ng build
firebase deploy --only hosting`
    }
  ];

  readonly selectedKey = signal(this.snippets[0].key);
  readonly selected = computed(
    () => this.snippets.find((snippet) => snippet.key === this.selectedKey()) ?? this.snippets[0]
  );

  select(key: string): void {
    this.selectedKey.set(key);
  }
}
