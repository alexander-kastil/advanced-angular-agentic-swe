import { Component } from '@angular/core';
import { SkillsResourceComponent } from './skills-resource.component';

@Component({
    selector: 'app-http-tests-signal',
    imports: [SkillsResourceComponent],
    template: `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">httpResource()</h2>
        </div>
        <div class="card-content">
          <p>
            <code>httpResource()</code> issues its request through HttpClient, so
            <b>HttpTestingController</b> can flush it in the spec.
          </p>
          <app-skills-resource />
        </div>
      </div>
    `,
})
export class HttpTestsSignalComponent { }
