import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownRendererComponent, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton, RouterLink, RouterOutlet]
})
export class RoutingComponent {
  links: { label: string; id: number; readonly: boolean }[] = [
    { label: 'Route A', id: 1, readonly: true },
    { label: 'Route B', id: 2, readonly: false },
    { label: 'Route C', id: 3, readonly: true }
  ];
}
