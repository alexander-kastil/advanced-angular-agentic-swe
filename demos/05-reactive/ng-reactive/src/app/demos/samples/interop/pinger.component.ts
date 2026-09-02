import { Component, output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pinger',
  imports: [MatButton],
  template: `
    <button mat-raised-button color="accent" (click)="ping()">
      Ping the parent
    </button>
  `,
})
export class PingerComponent {
  readonly pinged = output<string>();

  protected ping() {
    this.pinged.emit(new Date().toLocaleTimeString());
  }
}
