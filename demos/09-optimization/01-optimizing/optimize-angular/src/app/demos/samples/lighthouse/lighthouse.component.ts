import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-lighthouse',
  templateUrl: './lighthouse.component.html',
  styleUrls: ['./lighthouse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownRendererComponent]
})
export class LighthouseComponent { }
