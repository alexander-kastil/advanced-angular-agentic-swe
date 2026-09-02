import { Component, output } from '@angular/core';

@Component({
  selector: 'app-pinger',
  template: `
    <button type="button" class="btn btn-primary" (click)="ping()">
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
