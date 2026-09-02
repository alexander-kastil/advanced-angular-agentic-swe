import { Component, input, model, output } from '@angular/core';
import { FormValueControl, transformedValue } from '@angular/forms/signals';

@Component({
  selector: 'app-money-input',
  styles: `
    .money {
      width: 12rem;
    }

    .error {
      font-size: 0.8125rem;
      color: #dc2626;
    }
  `,
  template: `
    <input
      class="input money"
      type="text"
      inputmode="decimal"
      [attr.aria-label]="label()"
      [value]="rawValue()"
      [disabled]="disabled()"
      (input)="rawValue.set($any($event.target).value)"
      (blur)="touch.emit()"
    />
    @for (err of rawValue.parseErrors(); track err.kind) {
      <div class="error">{{ err.message }}</div>
    }
  `,
})
export class MoneyInputComponent implements FormValueControl<number | null> {
  readonly value = model.required<number | null>();
  readonly disabled = input(false);
  readonly label = input('Amount');
  readonly touch = output<void>();

  protected readonly rawValue = transformedValue(this.value, {
    parse: (raw: string) => {
      const trimmed = raw.trim().replace(/[^0-9.,-]/g, '').replace(',', '.');
      if (trimmed === '') {
        return { value: null };
      }
      const parsed = Number(trimmed);
      return Number.isNaN(parsed)
        ? { error: { kind: 'money', message: `"${raw}" is not an amount` } }
        : { value: parsed };
    },
    format: (value: number | null) => (value === null ? '' : value.toFixed(2)),
  });
}
