import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../../../auth/auth.store';
import { EchoBody } from '../../../auth/echo-backend.interceptor';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface Outcome {
  url: string;
  status: number;
  authorization: string;
}

@Component({
  selector: 'app-auth-interceptor',
  templateUrl: './auth-interceptor.component.html',
  styleUrl: './auth-interceptor.component.scss',
  imports: [CodeBlockComponent]
})
export class AuthInterceptorComponent {
  private readonly http = inject(HttpClient);
  readonly auth = inject(AuthStore);

  readonly outcomes = signal<Outcome[]>([]);

  readonly targets = [
    'https://api.ng-oauth.demo/orders',
    'https://cdn.thirdparty.demo/fonts.json',
    'https://api.ng-oauth.demo.attacker.example/steal'
  ];

  readonly interceptorSnippet = `export const PROTECTED_APIS = new InjectionToken<string[]>('PROTECTED_APIS', {
  factory: () => ['https://api.ng-oauth.demo/']
});

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStore);
  const protectedApis = inject(PROTECTED_APIS);
  const token = auth.token();
  const isProtected = protectedApis.some((api) => req.url.startsWith(api));

  if (!token || !auth.isAuthenticated() || !isProtected) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } }));
};`;

  readonly routeSnippet = `{
  path: 'auth-interceptor',
  providers: [provideHttpClient(withInterceptors([authInterceptor, echoBackendInterceptor]))],
  loadComponent: () => import('./samples/auth-interceptor/auth-interceptor.component')
}`;

  async call(url: string): Promise<void> {
    let outcome: Outcome;
    try {
      const body = await firstValueFrom(this.http.get<EchoBody>(url));
      outcome = { url, status: 200, authorization: body.headers['Authorization'] ?? '(none)' };
    } catch (error) {
      const response = error as HttpErrorResponse;
      outcome = {
        url,
        status: response.status,
        authorization: (response.error as EchoBody)?.headers['Authorization'] ?? '(none)'
      };
    }
    this.outcomes.update((list) => [outcome, ...list].slice(0, 6));
  }

  short(token: string): string {
    return token.length > 40 ? `${token.slice(0, 40)}...` : token;
  }
}
