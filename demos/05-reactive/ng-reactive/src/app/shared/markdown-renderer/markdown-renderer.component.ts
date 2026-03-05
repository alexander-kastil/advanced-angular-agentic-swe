import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MarkdownComponent } from 'ngx-markdown';
import { environment } from '../../../environments/environment';
import { RendererStateService } from './renderer-state.service';

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

  md = input.required<string>();
  contentVisible = this.state.visible;
  markdownSrc = computed(() => `${environment.markdownPath}${this.md()}.md`);

  togglePanel() {
    this.state.toggleVisibility();
  }
}
