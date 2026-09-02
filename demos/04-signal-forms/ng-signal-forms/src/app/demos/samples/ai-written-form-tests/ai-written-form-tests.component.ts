import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, form, max, min, pattern, required, submit, validate } from '@angular/forms/signals';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

export interface OrderModel {
  sku: string;
  quantity: number;
  voucher: string;
}

export interface AssertionResult {
  name: string;
  passed: boolean;
}

export const SKU_PATTERN = /^[A-Z]{3}-[0-9]{4}$/;

@Component({
  selector: 'app-ai-written-form-tests',
  templateUrl: './ai-written-form-tests.component.html',
  styleUrls: ['./ai-written-form-tests.component.scss'],
  imports: [
    FormField,
    BoxedDirective, ColumnDirective, JsonPipe,
  ],
})
export class AiWrittenFormTestsComponent {
  readonly mutated = signal(false);
  readonly submittedOrder = signal<OrderModel | null>(null);
  readonly results = signal<AssertionResult[]>([]);

  readonly model = signal<OrderModel>({ sku: '', quantity: 1, voucher: '' });

  readonly orderForm = form(this.model, (s) => {
    required(s.sku, { message: 'SKU is required' });
    pattern(s.sku, SKU_PATTERN, { message: 'SKU looks like ABC-1234' });
    min(s.quantity, () => (this.mutated() ? 0 : 1), { message: 'Order at least one item' });
    max(s.quantity, 99, { message: 'At most 99 items per order' });
    validate(s.voucher, ({ value }) =>
      value() !== '' && value().length < 5 ? { kind: 'voucher', message: 'Vouchers have 5 characters' } : null,
    );
  });

  toggleMutation(checked: boolean): void {
    this.mutated.set(checked);
    if (this.results().length) {
      this.runAssertions();
    }
  }

  runAssertions(): void {
    const snapshot = this.model();
    this.results.set([
      { name: 'blank SKU is invalid', passed: !this.skuValid('') },
      { name: 'ABC-1234 is a valid SKU', passed: this.skuValid('ABC-1234') },
      { name: 'abc-1234 is rejected', passed: !this.skuValid('abc-1234') },
      { name: 'quantity 0 is rejected', passed: !this.quantityValid(0) },
      { name: 'quantity 1 is accepted', passed: this.quantityValid(1) },
      { name: 'quantity 100 is rejected', passed: !this.quantityValid(100) },
    ]);
    this.model.set(snapshot);
  }

  place(): void {
    submit(this.orderForm, async () => {
      this.submittedOrder.set(this.model());
    });
  }

  reset(): void {
    this.model.set({ sku: '', quantity: 1, voucher: '' });
    this.orderForm().reset();
    this.submittedOrder.set(null);
    this.results.set([]);
  }

  private skuValid(candidate: string): boolean {
    this.orderForm.sku().value.set(candidate);
    return this.orderForm.sku().valid();
  }

  private quantityValid(candidate: number): boolean {
    this.orderForm.quantity().value.set(candidate);
    return this.orderForm.quantity().valid();
  }
}
