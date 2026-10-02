import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { EchoBody } from '../../../auth/echo-backend.interceptor';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface CallResult {
  title: string;
  status: number;
  responseHeaders: string[];
  body: string;
}

const API = 'https://api.ng-oauth.demo/orders';

@Component({
  selector: 'app-bearer-requests',
  templateUrl: './bearer-requests.component.html',
  styleUrl: './bearer-requests.component.scss',
  imports: [CodeBlockComponent]
})
export class BearerRequestsComponent {
  private readonly http = inject(HttpClient);

  readonly token = signal('eyJhbGciOiJub25lIn0.eyJzdWIiOiJhZGEifQ.');
  readonly result = signal<CallResult | null>(null);

  readonly bodySnippet = `this.http.get<Order[]>(url)`;

  readonly responseSnippet = `this.http.get<Order[]>(url, { observe: 'response' })
// HttpResponse<Order[]>: status, headers, body`;

  readonly headerSnippet = `this.http.get<Order[]>(url, {
  headers: new HttpHeaders({ Authorization: \`Bearer \${token}\` })
})`;

  async bodyOnly(): Promise<void> {
    await this.run('Body only', () => this.http.get<EchoBody>(API));
  }

  async fullResponse(): Promise<void> {
    await this.run('observe: response', () => this.http.get<EchoBody>(API, { observe: 'response' }));
  }

  async withHeader(): Promise<void> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token()}` });
    await this.run('Authorization header', () =>
      this.http.get<EchoBody>(API, { headers, observe: 'response' })
    );
  }

  setToken(value: string): void {
    this.token.set(value);
  }

  private async run(
    title: string,
    call: () => Observable<EchoBody | HttpResponse<EchoBody>>
  ): Promise<void> {
    try {
      const value = await firstValueFrom(call());
      if (value instanceof HttpResponse) {
        this.result.set({
          title,
          status: value.status,
          responseHeaders: value.headers.keys().map((key) => `${key}: ${value.headers.get(key)}`),
          body: JSON.stringify(value.body, null, 2)
        });
      } else {
        this.result.set({
          title,
          status: 200,
          responseHeaders: ['(not observable: only the body was returned)'],
          body: JSON.stringify(value, null, 2)
        });
      }
    } catch (error) {
      const response = error as HttpErrorResponse;
      this.result.set({
        title,
        status: response.status,
        responseHeaders: response.headers.keys().map((key) => `${key}: ${response.headers.get(key)}`),
        body: JSON.stringify(response.error, null, 2)
      });
    }
  }
}
