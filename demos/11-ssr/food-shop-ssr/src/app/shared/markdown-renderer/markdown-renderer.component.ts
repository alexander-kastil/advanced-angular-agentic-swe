import { Component, computed, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-markdown-renderer',
  host: { ngSkipHydration: 'true' },
  imports: [MarkdownComponent],
  templateUrl: './markdown-renderer.component.html',
  styleUrl: './markdown-renderer.component.scss',
})
export class MarkdownRendererComponent {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly md = input.required<string>();
  readonly src = computed(() => `${environment.markdownPath}${this.md()}.md`);
}
