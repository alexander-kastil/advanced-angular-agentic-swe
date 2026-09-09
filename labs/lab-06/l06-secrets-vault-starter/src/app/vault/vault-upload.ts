import { Component, computed, inject, input, output, signal } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { Secret } from '../secrets/secret';
import { retryWithBackoff } from './retry-with-backoff';

type UploadState = 'idle' | 'uploading' | 'done' | 'failed';

@Component({
  selector: 'app-vault-upload',
  templateUrl: './vault-upload.html',
  styleUrl: './vault-upload.css',
})
export class VaultUpload {
  private readonly http = inject(HttpClient);

  readonly listId = input.required<string>();
  readonly uploaded = output<Secret>();

  readonly state = signal<UploadState>('idle');
  readonly progress = signal(0);
  readonly fileName = signal<string | null>(null);
  readonly failure = signal<string | null>(null);

  readonly isBusy = computed(() => this.state() === 'uploading');

  choose(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.upload(file);
  }

  private upload(file: File): void {
    const body = new FormData();
    body.set('listId', this.listId());
    body.set('file', file, file.name);
    body.set('name', file.name.replace(/\.[^.]+$/, ''));

    this.state.set('uploading');
    this.progress.set(0);
    this.fileName.set(file.name);
    this.failure.set(null);

    this.http
      .post<Secret>('/api/secrets/upload', body, { reportProgress: true, observe: 'events' })
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progress.set(Math.round((event.loaded / event.total) * 100));
          }
        }),
        retryWithBackoff(3),
        map((event) => (event.type === HttpEventType.Response ? event.body : null)),
      )
      .subscribe({
        next: (secret) => {
          if (!secret) return;
          this.progress.set(100);
          this.state.set('done');
          this.uploaded.emit(secret);
        },
        error: () => {
          this.state.set('failed');
          this.failure.set('The vault refused the file after three attempts.');
        },
      });
  }

  export(): void {
    this.http
      .get('/api/secrets/export', { responseType: 'blob' })
      .pipe(retryWithBackoff(3))
      .subscribe((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'secrets-export.csv';
        link.click();
        URL.revokeObjectURL(url);
      });
  }
}
