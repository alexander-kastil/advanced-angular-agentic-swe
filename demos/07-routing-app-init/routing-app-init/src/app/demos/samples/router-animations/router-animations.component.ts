import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-router-animations',
  templateUrl: './router-animations.component.html',
  styleUrls: ['./router-animations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownRendererComponent]
})
export class RouterAnimationsComponent { }
