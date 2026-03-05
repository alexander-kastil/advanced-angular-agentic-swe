import { ChangeDetectionStrategy, Component, computed, inject, input, NgZone } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MarkdownComponent } from 'ngx-markdown';
import { environment } from '../../../environments/environment';
import { RendererStateService } from './renderer-state.service';
import { LibraryLoaderService } from '../services/library-loader.service';

@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrl: './markdown-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MarkdownComponent,
  ]
})
export class MarkdownRendererComponent {
  private state = inject(RendererStateService);
  private ngZone = inject(NgZone);
  private libLoader = inject(LibraryLoaderService);

  md = input.required<string>();
  contentVisible = this.state.visible;
  markdownSrc = computed(() => `${environment.markdownPath}${this.md()}.md`);

  togglePanel() {
    this.state.toggleVisibility();
  }

  async onMarkdownLoad() {
    try {
      await this.libLoader.loadMermaid();
      await this.libLoader.loadPrismJsTheme();

      this.ngZone.runOutsideAngular(async () => {
        setTimeout(async () => {
          const mermaid = await import('mermaid');
          await mermaid.default.run();
        }, 100);
      });
    } catch (error) {
      console.error('Error rendering mermaid diagrams:', error);
    }
  }
}
