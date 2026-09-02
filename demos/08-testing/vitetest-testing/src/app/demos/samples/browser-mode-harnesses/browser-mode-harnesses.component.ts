import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NotificationPrefsComponent } from './notification-prefs.component';

@Component({
  selector: 'app-browser-mode-harnesses',
  imports: [MatCardModule, NotificationPrefsComponent],
  template: `
    <div class="grid">
      <app-notification-prefs />

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>One spec, two environments</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            The spec next to this component never touches a CSS selector. It asks
            <code>TestbedHarnessEnvironment</code> for a harness and talks to the component through its
            public API, so the same file runs unchanged under jsdom and under Vitest browser mode.
          </p>
          @for (row of comparison; track row.aspect) {
            <div class="row" data-testid="comparison-row">
              <b>{{ row.aspect }}</b>
              <span>jsdom: {{ row.jsdom }}</span>
              <span>browser: {{ row.browser }}</span>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Switching this app to browser mode</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <pre data-testid="setup">{{ setup }}</pre>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    mat-card { max-width: 32rem; }
    .row { display: flex; flex-direction: column; margin-bottom: .6rem; }
    pre { white-space: pre-wrap; margin: 0; }
  `],
})
export class BrowserModeHarnessesComponent {
  readonly comparison = [
    {
      aspect: 'Layout and geometry',
      jsdom: 'every box is 0 by 0, getBoundingClientRect lies',
      browser: 'real layout, so overlay positioning and scrolling behave',
    },
    {
      aspect: 'Overlays (select, menu, dialog)',
      jsdom: 'render into the overlay container but are never painted',
      browser: 'painted and hit-testable, so a stray z-index actually fails',
    },
    {
      aspect: 'Animations',
      jsdom: 'need NoopAnimationsModule',
      browser: 'run, and the harness waits for stability anyway',
    },
    {
      aspect: 'Speed',
      jsdom: 'milliseconds per spec',
      browser: 'a browser start-up per run',
    },
  ];

  readonly setup = [
    '# 1. install the runner pieces browser mode needs',
    'npm i -D @vitest/browser playwright',
    '',
    '# 2. add a second target next to test in angular.json',
    '"test-browser": {',
    '  "builder": "@angular/build:unit-test",',
    '  "options": {',
    '    "tsConfig": "tsconfig.spec.json",',
    '    "buildTarget": "vitest-testing:build",',
    '    "browsers": ["chromium"]',
    '  }',
    '}',
    '',
    '# 3. run it',
    'ng run vitest-testing:test-browser',
  ].join('\n');
}
