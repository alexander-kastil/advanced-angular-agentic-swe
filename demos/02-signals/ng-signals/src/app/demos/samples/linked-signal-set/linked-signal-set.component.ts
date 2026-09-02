import { Component, linkedSignal, signal, untracked } from '@angular/core';
import { BorderDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-linked-signal-set',
  imports: [BorderDirective],
  template: `
    <div border class="state">
      <div>stock (source): {{ stock() }}</div>
      <div>quantity (linked, writable): {{ quantity() }}</div>
      <div>last write: {{ lastWrite() }}</div>
    </div>

    <div class="actions">
      <button type="button" class="btn btn-primary" (click)="restock()">Restock (+5)</button>
      <button type="button" class="btn btn-primary" (click)="sellOut()">Sell out (stock = 2)</button>
      <button type="button" class="btn btn-primary" (click)="request(3)">Order 3</button>
      <button type="button" class="btn btn-primary" (click)="request(99)">Order 99</button>
      <button type="button" class="btn btn-primary" (click)="request(0)">Order 0</button>
    </div>
  `,
  styles: `
    .state {
      display: flex;
      flex-direction: column;
      gap: var(--gap-small);
    }

    .actions {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--gap-small);
      margin-top: var(--gap-medium);
    }
  `,
})
export class LinkedSignalSetComponent {
  readonly stock = signal(10, { debugName: 'stock' });
  readonly lastWrite = signal('none');

  readonly quantity = linkedSignal<number, number>({
    source: () => this.stock(),
    computation: (stock, previous) => Math.min(previous?.value ?? 1, stock),
    set: (value, rawSet) => {
      const stock = untracked(this.stock);
      const clamped = Math.min(Math.max(value, 1), stock);
      this.lastWrite.set(`asked for ${value}, stored ${clamped}`);
      rawSet(clamped);
    },
    debugName: 'quantity',
  });

  restock() {
    this.stock.update((s) => s + 5);
  }

  sellOut() {
    this.stock.set(2);
  }

  request(value: number) {
    this.quantity.set(value);
  }
}
