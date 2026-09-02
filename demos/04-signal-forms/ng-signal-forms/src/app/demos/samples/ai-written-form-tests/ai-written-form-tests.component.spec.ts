import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMarkdown } from 'ngx-markdown';
import { beforeEach, describe, expect, it } from 'vitest';
import { AiWrittenFormTestsComponent } from './ai-written-form-tests.component';

describe('AiWrittenFormTestsComponent', () => {
  let component: AiWrittenFormTestsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiWrittenFormTestsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMarkdown()],
    }).compileComponents();

    component = TestBed.createComponent(AiWrittenFormTestsComponent).componentInstance;
  });

  it('rejects a blank SKU with the required error', () => {
    expect(component.orderForm.sku().valid()).toBe(false);
    expect(component.orderForm.sku().getError('required')).toBeDefined();
  });

  it('accepts a SKU matching ABC-1234', () => {
    component.orderForm.sku().value.set('ABC-1234');
    expect(component.orderForm.sku().valid()).toBe(true);
  });

  it('rejects a lowercase SKU with the pattern error', () => {
    component.orderForm.sku().value.set('abc-1234');
    expect(component.orderForm.sku().valid()).toBe(false);
    expect(component.orderForm.sku().getError('pattern')).toBeDefined();
  });

  it('rejects quantity 0 and accepts quantity 1', () => {
    component.orderForm.quantity().value.set(0);
    expect(component.orderForm.quantity().valid()).toBe(false);

    component.orderForm.quantity().value.set(1);
    expect(component.orderForm.quantity().valid()).toBe(true);
  });

  it('rejects quantity 100 and accepts quantity 99', () => {
    component.orderForm.quantity().value.set(100);
    expect(component.orderForm.quantity().getError('max')).toBeDefined();

    component.orderForm.quantity().value.set(99);
    expect(component.orderForm.quantity().valid()).toBe(true);
  });

  it('treats an empty voucher as valid but a short one as invalid', () => {
    expect(component.orderForm.voucher().valid()).toBe(true);

    component.orderForm.voucher().value.set('AB');
    expect(component.orderForm.voucher().getError('voucher')?.message).toBe('Vouchers have 5 characters');
  });

  it('catches the mutation that lowers the quantity floor to zero', () => {
    component.mutated.set(true);
    component.orderForm.quantity().value.set(0);
    expect(component.orderForm.quantity().valid()).toBe(true);

    component.mutated.set(false);
    expect(component.orderForm.quantity().valid()).toBe(false);
  });

  it('reports every assertion as passing while the schema is intact', () => {
    component.runAssertions();
    expect(component.results().every((r) => r.passed)).toBe(true);
  });

  it('turns an assertion red once the mutation is applied', () => {
    component.toggleMutation(true);
    component.runAssertions();
    expect(component.results().some((r) => !r.passed)).toBe(true);
  });
});
