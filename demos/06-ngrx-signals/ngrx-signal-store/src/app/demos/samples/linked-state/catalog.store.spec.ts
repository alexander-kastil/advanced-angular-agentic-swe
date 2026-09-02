import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { CatalogStore } from './catalog.store';

describe('CatalogStore (withLinkedState)', () => {
  let store: InstanceType<typeof CatalogStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CatalogStore] });
    store = TestBed.inject(CatalogStore);
  });

  it('links selectedId and seats to the first course of the source list', () => {
    expect(store.selectedId()).toBe(1);
    expect(store.seats()).toBe(2);
    expect(store.selected()?.name).toBe('Angular Signals');
  });

  it('recomputes the linked seats slice when the selection changes', () => {
    store.select(2);

    expect(store.seats()).toBe(3);
    expect(store.net()).toBe(4800);
    expect(store.gross()).toBe(5760);
  });

  it('keeps the linked seats slice writable between recomputations', () => {
    store.select(2);
    store.setSeats(5);

    expect(store.seats()).toBe(5);
    expect(store.net()).toBe(8000);
  });

  it('clamps a written seat count to at least one', () => {
    store.setSeats(-4);

    expect(store.seats()).toBe(1);
  });

  it('recomputes gross when only the tax rate changes', () => {
    store.setTaxRate(0.1);

    expect(store.net()).toBe(2400);
    expect(store.gross()).toBe(2640);
  });

  it('falls back to the first remaining course when the selected one is removed', () => {
    store.select(2);
    store.setSeats(9);
    store.dropSelected();

    expect(store.courses().map((c) => c.id)).toEqual([1, 3, 4]);
    expect(store.selectedId()).toBe(1);
    expect(store.seats()).toBe(2);
  });

  it('preserves a still valid selection when the source list is restored', () => {
    store.select(3);
    store.dropSelected();
    store.restoreCatalog();

    expect(store.courses()).toHaveLength(4);
    expect(store.selectedId()).toBe(1);
  });
});
