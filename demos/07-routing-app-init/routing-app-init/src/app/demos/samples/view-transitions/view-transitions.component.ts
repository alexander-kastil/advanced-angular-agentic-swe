import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-view-transitions',
  imports: [MarkdownRendererComponent, RouterLink],
  templateUrl: './view-transitions.component.html',
  styleUrl: './view-transitions.component.scss',
})
export class ViewTransitionsComponent {
  readonly supported = signal('startViewTransition' in document);
}
