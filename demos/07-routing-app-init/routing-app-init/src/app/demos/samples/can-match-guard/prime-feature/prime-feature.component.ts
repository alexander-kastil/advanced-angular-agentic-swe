import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-prime-feature',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Prime Feature</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>This chunk was downloaded only because canMatch let the route match.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class PrimeFeatureComponent {}
