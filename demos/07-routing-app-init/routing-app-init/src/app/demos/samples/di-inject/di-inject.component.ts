import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { DemoService } from '../../demo-container/demo.service';

@Component({
  selector: 'app-di-inject',
  templateUrl: './di-inject.component.html',
  styleUrls: ['./di-inject.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownRendererComponent]
})
export class DiInjectComponent {
  service = inject(DemoService);
  demos = this.service.getDemos();
}
