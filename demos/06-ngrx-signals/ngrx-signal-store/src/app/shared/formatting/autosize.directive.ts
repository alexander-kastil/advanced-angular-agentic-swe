import { Directive, ElementRef, afterRenderEffect, inject } from '@angular/core';

@Directive({
  selector: 'textarea[autosize]',
  host: {
    '(input)': 'resize()',
  },
})
export class AutosizeDirective {
  private el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);

  constructor() {
    afterRenderEffect(() => this.resize());
  }

  resize() {
    const textarea = this.el.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
