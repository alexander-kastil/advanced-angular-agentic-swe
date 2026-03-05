import { ChangeDetectionStrategy, Component, resource, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { JsonPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-http-resource',
  templateUrl: './http-resource.component.html',
  styleUrls: ['./http-resource.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatButton,
    MatProgressSpinner,
    JsonPipe
  ]
})
export class HttpResourceComponent {
  private http = inject(HttpClient);
  protected todoId = signal(1);

  protected todoResource = resource({
    loader: async () => {
      return await firstValueFrom(
        this.http.get<Todo>(`https://jsonplaceholder.typicode.com/todos/${this.todoId()}`)
      );
    }
  });

  protected loadNext() {
    this.todoId.update(id => id + 1);
    this.todoResource.reload();
  }

  protected loadPrevious() {
    this.todoId.update(id => Math.max(1, id - 1));
    this.todoResource.reload();
  }

  protected reload() {
    this.todoResource.reload();
  }
}
