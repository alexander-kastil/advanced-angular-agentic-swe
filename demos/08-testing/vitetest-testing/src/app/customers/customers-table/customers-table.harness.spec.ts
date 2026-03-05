import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customer } from '../customer.model';
import { CustomersTableComponent } from './customers-table.component';

describe('Component - Material Harness - CustomersTableComponent', () => {
  let fixture: ComponentFixture<CustomersTableComponent>;
  let component: CustomersTableComponent;
  let loader: HarnessLoader;

  const mockCustomers: Customer[] = [
    { id: 1, name: 'Soi' },
    { id: 2, name: 'Giro' },
    { id: 3, name: 'Flora' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersTableComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('customers', mockCustomers);
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should render a table with 3 rows', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();
    expect(rows.length).toBe(3);
  });

  it('should display correct customer names in table rows', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();
    const firstRowCells = await rows[0].getCells();
    const cellTexts = await Promise.all(firstRowCells.map(c => c.getText()));
    expect(cellTexts).toContain('Soi');
  });

  it('should have an Add Customer button', async () => {
    const addBtn = await loader.getHarness(
      MatButtonHarness.with({ text: 'Add Customer' })
    );
    expect(addBtn).toBeTruthy();
  });

  it('should emit add event when Add Customer is clicked via harness', async () => {
    const addSpy = vi.fn();
    component.add.subscribe(addSpy);

    const addBtn = await loader.getHarness(
      MatButtonHarness.with({ text: 'Add Customer' })
    );
    await addBtn.click();

    expect(addSpy).toHaveBeenCalled();
  });

  it('should emit edit event when edit button is clicked via harness', async () => {
    const editSpy = vi.fn();
    component.edit.subscribe(editSpy);

    const editBtns = await loader.getAllHarnesses(MatButtonHarness.with({ variant: 'icon' }));
    await editBtns[0].click();

    expect(editSpy).toHaveBeenCalledWith(mockCustomers[0]);
  });
});
