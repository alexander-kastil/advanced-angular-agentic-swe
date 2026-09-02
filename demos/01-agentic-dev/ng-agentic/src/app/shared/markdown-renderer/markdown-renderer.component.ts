import { httpResource } from '@angular/common/http';
import { Component, computed, input } from '@angular/core';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown-renderer',
  template: `<div class="markdown" [innerHTML]="html()"></div>`,
  styleUrl: './markdown-renderer.component.scss'
})
export class MarkdownRendererComponent {
  readonly src = input.required<string>();

  private readonly file = httpResource.text(() => this.src());

  readonly html = computed(() =>
    marked.parse(this.file.value() ?? '', { async: false, gfm: true })
  );
}
