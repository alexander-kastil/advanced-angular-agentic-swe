import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SkillsResourceComponent } from './skills-resource.component';

@Component({
    selector: 'app-http-tests-signal',
    imports: [MatCardModule, SkillsResourceComponent],
    template: `
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>httpResource()</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            <code>httpResource()</code> issues its request through HttpClient, so
            <b>HttpTestingController</b> can flush it in the spec.
          </p>
          <app-skills-resource />
        </mat-card-content>
      </mat-card>
    `,
})
export class HttpTestsSignalComponent { }
