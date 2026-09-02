import { Component, inject, injectAsync, onIdle, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { StartupLogService } from './startup-log.service';

@Component({
  selector: 'app-app-initializer-async',
  templateUrl: './app-initializer-async.component.html',
  styleUrls: ['./app-initializer-async.component.scss'],
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
export class AppInitializerAsyncComponent {
  private log = inject(StartupLogService);

  private loadFlags = injectAsync(
    () => import('./remote-flags.service').then((m) => m.RemoteFlagsService),
    { prefetch: onIdle }
  );

  readonly entries = this.log.entries;
  readonly flags = signal<string[]>([]);
  readonly loading = signal(false);

  async showFlags() {
    this.loading.set(true);
    const flags = await this.loadFlags();
    this.flags.set(flags.enabled());
    this.loading.set(false);
  }
}
