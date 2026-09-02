import { Component, input, signal, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-expander-template',
  templateUrl: './expander-template.component.html',
  styleUrls: ['./expander-template.component.scss'],
  imports: [NgTemplateOutlet],
})
export class ExpanderTemplateComponent {
  readonly title = input('');
  readonly content = input<TemplateRef<unknown> | null>(null);
  readonly expanded = signal(false);

  toggleExpander() {
    this.expanded.update((v) => !v);
  }
}
