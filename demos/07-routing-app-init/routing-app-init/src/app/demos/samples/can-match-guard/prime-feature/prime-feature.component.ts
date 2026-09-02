import { Component } from '@angular/core';

@Component({
  selector: 'app-prime-feature',
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Prime Feature</h2>
      </div>
      <div class="card-content">
        <p>This chunk was downloaded only because canMatch let the route match.</p>
      </div>
    </div>
  `,
})
export class PrimeFeatureComponent {}
