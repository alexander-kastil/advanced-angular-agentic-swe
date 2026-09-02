import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-playwright',
  imports: [RouterLink],
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Playwright E2E</h2>
      </div>
      <div class="card-content">
        <p>
          The specs drive the real Customers screen in a browser. Start
          <code>ng serve</code> and <code>json-server</code>, then run
          <code>npx playwright test</code>.
        </p>
        @for (file of files; track file.name) {
          <div class="row">
            <code>e2e/{{ file.name }}</code>
            <span>{{ file.purpose }}</span>
          </div>
        }
        <button type="button" class="btn btn-primary self-start" routerLink="/customers">
          Open the screen under test
        </button>
      </div>
    </div>
  `,
  styles: [`
    .row { display: flex; gap: 1rem; margin-bottom: .25rem; }
    .row code { min-width: 14rem; }
  `],
})
export class PlaywrightComponent {
  readonly files = [
    { name: 'customers.fixture.ts', purpose: 'CustomersPage POM and the fixture that resets json-server data' },
    { name: 'customers.spec.ts', purpose: 'Fixture based tests for load, edit, delete and add' },
    { name: 'customers.interaction.ts', purpose: 'Sequential script mirroring manual exploration' },
  ];
}
