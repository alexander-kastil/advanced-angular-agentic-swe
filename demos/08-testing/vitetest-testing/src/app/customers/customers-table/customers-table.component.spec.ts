import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customer } from '../customer.model';
import { CustomersTableComponent } from './customers-table.component';

describe('Component - DOM - CustomersTableComponent', () => {
  let fixture: ComponentFixture<CustomersTableComponent>;
  let component: CustomersTableComponent;

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
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render one row per customer', () => {
    const rows = fixture.debugElement.queryAll(By.css('mat-row'));
    expect(rows.length).toBe(3);
  });

  it('should display customer names in table cells', () => {
    const cells = fixture.debugElement.queryAll(By.css('mat-cell'));
    const cellTexts = cells.map(c => c.nativeElement.textContent.trim());
    expect(cellTexts).toContain('Soi');
    expect(cellTexts).toContain('Giro');
    expect(cellTexts).toContain('Flora');
  });

  it('should show the progress bar when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const bar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(bar).toBeTruthy();
  });

  it('should hide the progress bar when not loading', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const bar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(bar).toBeNull();
  });

  it('should emit edit event when edit button is clicked', () => {
    const editSpy = vi.fn();
    component.edit.subscribe(editSpy);

    const firstRow = fixture.debugElement.query(By.css('mat-row'));
    const editBtn = firstRow.query(By.css('button[color=primary]'));
    editBtn.nativeElement.click();

    expect(editSpy).toHaveBeenCalledWith(mockCustomers[0]);
  });

  it('should emit delete event with customer id when delete button is clicked', () => {
    const deleteSpy = vi.fn();
    component.delete.subscribe(deleteSpy);

    const deleteBtn = fixture.debugElement.queryAll(By.css('button[color=warn]'))[0];
    deleteBtn.nativeElement.click();

    expect(deleteSpy).toHaveBeenCalledWith(mockCustomers[0].id);
  });

  it('should emit add event when Add Customer button is clicked', () => {
    const addSpy = vi.fn();
    component.add.subscribe(addSpy);

    const addBtn = fixture.debugElement.query(By.css('button[color=primary]'));
    addBtn.nativeElement.click();

    expect(addSpy).toHaveBeenCalled();
  });
});
