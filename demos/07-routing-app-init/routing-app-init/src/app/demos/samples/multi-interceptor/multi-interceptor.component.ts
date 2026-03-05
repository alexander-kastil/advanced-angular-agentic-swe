import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { firstValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-multi-interceptor',
  templateUrl: './multi-interceptor.component.html',
  styleUrls: ['./multi-interceptor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    JsonPipe
  ]
})
export class MultiInterceptorComponent {
  private http = inject(HttpClient);

  protected requestUrl = signal<string>('https://jsonplaceholder.typicode.com/todos/1');

  protected data = resource({
    loader: async () => {
      const url = this.requestUrl();
      return await firstValueFrom(this.http.get(url));
    }
  });

  protected requestData() {
    this.requestUrl.set('https://jsonplaceholder.typicode.com/todos/1');
    this.data.reload();
  }

  protected requestXMLData() {
    this.requestUrl.set(
      'https://api.openweathermap.org/data/2.5/weather?q=London&mode=xml&appid=25a0801691214cdec4c44e5b125b6396'
    );
    this.data.reload();
  }

  protected request404Data() {
    this.requestUrl.set('https://jsonplaceholder.typicode.com/todos/7878');
    this.data.reload();
  }
}
