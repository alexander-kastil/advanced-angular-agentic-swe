import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-view-transitions',
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    RouterLink,
  ],
  templateUrl: './view-transitions.component.html',
  styleUrl: './view-transitions.component.scss',
})
export class ViewTransitionsComponent {
  readonly supported = signal('startViewTransition' in document);
}
