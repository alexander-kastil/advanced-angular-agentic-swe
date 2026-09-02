import { Component, computed, signal } from '@angular/core';

type GateKey = 'budgets' | 'template-a11y' | 'axe' | 'lighthouse';

interface Gate {
  key: GateKey;
  name: string;
  runs: string;
  configuredIn: string;
  failsWhen: string;
  failureText: string;
}

@Component({
  selector: 'app-compliance-gates',
  templateUrl: './compliance-gates.component.html',
  styleUrls: ['./compliance-gates.component.scss'],
  imports: []
})
export class ComplianceGatesComponent {
  readonly gates: Gate[] = [
    {
      key: 'budgets',
      name: 'Build budgets',
      runs: 'ng build --configuration production',
      configuredIn: 'angular.json, architect.build.configurations.production.budgets',
      failsWhen: 'The initial bundle passes maximumError, currently 2 MB. maximumWarning at 1 MB only prints.',
      failureText: 'ERROR: bundle initial exceeded maximum budget. Budget 2.00 MB was not met by 140.11 kB.'
    },
    {
      key: 'template-a11y',
      name: 'Template accessibility lint',
      runs: 'ng lint',
      configuredIn: 'eslint.config.js, the **/*.html block with the @angular-eslint/template rules',
      failsWhen: 'Any of the nine template accessibility rules reports, because every one is set to error.',
      failureText: 'error  <img/> element must have a text alternative  @angular-eslint/template/alt-text'
    },
    {
      key: 'axe',
      name: 'axe-core against the running app',
      runs: 'npx playwright test e2e/a11y.gate.spec.ts',
      configuredIn: 'e2e/a11y.gate.spec.ts, AxeBuilder tagged wcag2a wcag2aa wcag21a wcag21aa wcag22aa',
      failsWhen: 'Any violation is returned for any route under test.',
      failureText: 'Expected length: 0  Received length: 2  color-contrast, aria-required-children'
    },
    {
      key: 'lighthouse',
      name: 'Lighthouse CI against dist/',
      runs: 'npx --yes @lhci/cli@0.15.x autorun',
      configuredIn: 'lighthouserc.json, assert.assertions',
      failsWhen: 'A category score or a Core Web Vitals metric falls under its asserted minimum.',
      failureText: 'assertion failed: categories:accessibility failure  expected >= 0.95  found 0.88'
    }
  ];

  readonly failing = signal<Record<GateKey, boolean>>({
    budgets: false,
    'template-a11y': false,
    axe: false,
    lighthouse: false
  });

  readonly failedGates = computed(() => this.gates.filter(gate => this.failing()[gate.key]));

  readonly verdict = computed(() => (this.failedGates().length === 0 ? 'mergeable' : 'blocked'));

  readonly exitCode = computed(() => (this.failedGates().length === 0 ? 0 : 1));

  toggle(key: GateKey) {
    this.failing.update(state => ({ ...state, [key]: !state[key] }));
  }

  reset() {
    this.failing.set({ budgets: false, 'template-a11y': false, axe: false, lighthouse: false });
  }
}
