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
    <pre>{{ inherited() | json }}</pre>
  `,
  styles: `
    :host {
      display: block;
      padding: 12px;
      border: 1px dashed rgba(0, 0, 0, 0.24);
      border-radius: 4px;
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
