import { Component, signal } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

interface Panel {
  id: number;
  label: string;
}

@Component({
  selector: 'app-router-animations',
  templateUrl: './router-animations.component.html',
  styleUrls: ['./router-animations.component.scss'],
  imports: [MarkdownRendererComponent],
})
export class RouterAnimationsComponent {
  private nextId = 4;

  readonly panels = signal<Panel[]>([
    { id: 1, label: 'Route A' },
    { id: 2, label: 'Route B' },
    { id: 3, label: 'Route C' },
  ]);

  addPanel() {
    const id = this.nextId++;
    this.panels.update((panels) => [...panels, { id, label: `Route ${id}` }]);
  }

  removePanel(id: number) {
    this.panels.update((panels) => panels.filter((panel) => panel.id !== id));
  }
}
