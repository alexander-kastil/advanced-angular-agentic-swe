import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-http-errors',
  templateUrl: './http-errors.component.html',
  styleUrls: ['./http-errors.component.scss'],
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
  ],
})
export class HttpErrorsComponent {
  private http = inject(HttpClient);

  readonly lastError = signal('none');

  doCall() {
    this.lastError.set('calling /temos ...');
    this.http.get('http://localhost:3000/temos').subscribe({
      error: (error: Error) => this.lastError.set(error.message),
    });
  }

  throwErr() {
    throw new Error('A demo error is thrown and routed by the global ErrorHandler');
  }
}
