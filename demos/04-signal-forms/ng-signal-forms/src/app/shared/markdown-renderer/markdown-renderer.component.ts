import { Component, computed, inject, input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MarkdownComponent } from 'ngx-markdown';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { RendererStateService } from './renderer-state.service';

@Component({
  selector: 'app-markdown-renderer',
  templateUrl: './markdown-renderer.component.html',
  styleUrls: ['./markdown-renderer.component.scss'],
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
