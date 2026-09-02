
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownRendererModule } from 'src/app/shared/markdown-renderer/markdown-renderer.module';

@Component({
  selector: 'app-lazy-standalone',
  standalone: true,
  imports: [MarkdownModule, MarkdownRendererModule, RouterModule],
  templateUrl: './lazy-standalone.component.html',
  styleUrls: ['./lazy-standalone.component.scss'],
})
export class LazyStandaloneComponent {
}
