import { ChangeDetectionStrategy, Component, input, inject, signal, computed } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { JsonPipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

export interface Album {
  userId: number;
  id: number;
  title: string;
}

@Component({
  selector: 'app-httpresource-route-resolver',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatButton,
    MatProgressSpinner,
    JsonPipe,
    NgIf
  ],
  template: `
    <app-markdown-renderer [md]="'httpresource-route-resolver'" />
    
    <div class="demo-section">
      <h2>Album Data Resolved with httpResource</h2>
      <p><strong>Album ID:</strong> {{ album()?.id }}</p>
      <p><strong>Status:</strong> {{ resolverStatus() }}</p>
    </div>

    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Resolved Album Data</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (isLoading()) {
          <mat-progress-spinner diameter="30"></mat-progress-spinner>
          <p>Loading album data...</p>
        } @else if (hasError()) {
          <p class="error">Failed to load album data</p>
        } @else if (album(); as albumData) {
          <div>
            <h3>{{ albumData.title }}</h3>
            <pre>{{ albumData | json }}</pre>
            <p><em>User ID: {{ albumData.userId }}</em></p>
          </div>
        } @else {
          <p>No album data available</p>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="reloadAlbum()">Reload</button>
      </mat-card-actions>
    </mat-card>

    <mat-card appearance="outlined" class="mt-3">
      <mat-card-header>
        <mat-card-title>How It Works</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <ol>
          <li>Router uses <code>httpResourceAlbumResolver</code> to fetch album data</li>
          <li>Resolver returns the Album via httpResource()</li>
          <li>Component receives data via <code>input.required()</code></li>
          <li>Signals manage loading/error states automatically</li>
          <li>Component bindings are type-safe and auto-unwrapped</li>
        </ol>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .demo-section {
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .error {
      color: #d32f2f;
    }
    .mt-3 {
      margin-top: 20px;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  `]
})
export class HttpresourceRouteResolverComponent {
  private route = inject(ActivatedRoute);
  
  readonly album = input.required<Album>();
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  readonly resolverStatus = computed(() => {
    if (this.isLoading()) return 'Loading...';
    if (this.hasError()) return 'Error loading album';
    return `Loaded: Album #${this.album().id}`;
  });

  reloadAlbum() {
    this.isLoading.set(true);
    // Simulate reload delay
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }
}
