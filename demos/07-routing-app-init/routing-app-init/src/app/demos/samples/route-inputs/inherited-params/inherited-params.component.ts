import { JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-inherited-params',
  imports: [JsonPipe],
  template: `
    <p>
      This child route declares <code>path: ':section'</code> and nothing else, yet
      <code>tenant</code> and <code>release</code> arrive too. In Angular 22
      <code>paramsInheritanceStrategy</code> defaults to <code>'always'</code>, so every child
      inherits the parameters, data and resolved values of its ancestors.
    </p>
    <pre class="code" tabindex="0" role="region" aria-label="Inherited route parameters">{{ inherited() | json }}</pre>
  `,
  styles: `
    :host {
      display: block;
      padding: 12px;
      border: 1px dashed #cbd5e1;
      border-radius: 4px;
    }

    .code {
      overflow: auto;
      margin: 0.5rem 0 0;
      padding: 0.75rem;
      border-radius: 4px;
      background: #0f172a;
      color: #e2e8f0;
      font-size: 0.8rem;
      line-height: 1.4;
    }
  `,
})
export class InheritedParamsComponent {
  readonly section = input('');
  readonly tenant = input('');
  readonly release = input('');

  readonly inherited = computed(() => ({
    own: { section: this.section() },
    inheritedFromParent: { tenant: this.tenant(), release: this.release() },
  }));
}
