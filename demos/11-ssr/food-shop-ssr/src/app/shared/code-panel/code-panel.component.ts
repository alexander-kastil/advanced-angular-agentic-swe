import { Component, input } from '@angular/core';

@Component({
  selector: 'app-code-panel',
  template: `
    @if (heading()) {
      <h4>{{ heading() }}</h4>
    }
    <pre tabindex="0" role="region" [attr.aria-label]="heading() || 'Code sample'"><code>{{ code() }}</code></pre>
    @if (caption()) {
      <small>{{ caption() }}</small>
    }
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: 1rem;
    }

    h4 {
      margin: 0 0 0.35rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    pre {
      margin: 0;
      padding: 0.75rem 1rem;
      overflow-x: auto;
      border-radius: 6px;
      border: 1px solid #d9d9e3;
      background: #f6f6fa;
      font-size: 0.8rem;
      line-height: 1.45;
    }

    small {
      display: block;
      margin-top: 0.35rem;
      color: #64748b;
    }
  `,
})
export class CodePanelComponent {
  readonly heading = input('');
  readonly caption = input('');
  readonly code = input.required<string>();
}
