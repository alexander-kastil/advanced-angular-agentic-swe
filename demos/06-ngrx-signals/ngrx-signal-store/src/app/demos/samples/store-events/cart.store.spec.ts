import { TestBed } from '@angular/core/testing';
import { Dispatcher, provideDispatcher } from '@ngrx/signals/events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cartEvents } from './cart.events';
import { CartStore } from './cart.store';

describe('CartStore (events plugin)', () => {
  let store: InstanceType<typeof CartStore>;
  let dispatcher: Dispatcher;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideDispatcher(), CartStore] });
    store = TestBed.inject(CartStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts empty', () => {
    expect(store.lines()).toEqual([]);
    expect(store.lineCount()).toBe(0);
    expect(store.log()).toEqual([]);
    expect(store.orderNumber()).toBeNull();
  });

  it('reduces added events into lines and a newest-first log', () => {
    dispatcher.dispatch(cartEvents.added('Signals Workshop'));
    dispatcher.dispatch(cartEvents.added('Signal Forms'));

    expect(store.lines()).toEqual(['Signals Workshop', 'Signal Forms']);
    expect(store.lineCount()).toBe(2);
    expect(store.log()).toEqual(['added Signal Forms', 'added Signals Workshop']);
  });

  it('reduces a removed event by payload', () => {
    dispatcher.dispatch(cartEvents.added('Signals Workshop'));
    dispatcher.dispatch(cartEvents.added('Signal Forms'));
    dispatcher.dispatch(cartEvents.removed('Signals Workshop'));

    expect(store.lines()).toEqual(['Signal Forms']);
    expect(store.log()[0]).toBe('removed Signals Workshop');
  });

  it('clears the lines but keeps the log', () => {
    dispatcher.dispatch(cartEvents.added('Signal Forms'));
    dispatcher.dispatch(cartEvents.cleared());

    expect(store.lines()).toEqual([]);
    expect(store.log()).toEqual(['cleared', 'added Signal Forms']);
  });

  it('flags checkout in progress as soon as checkoutStarted is reduced', () => {
    vi.useFakeTimers();
    dispatcher.dispatch(cartEvents.added('Signal Forms'));
    dispatcher.dispatch(cartEvents.checkoutStarted());

    expect(store.checkingOut()).toBe(true);
    expect(store.lines()).toEqual(['Signal Forms']);
    expect(store.orderNumber()).toBeNull();
  });

  it('lets the withEventHandlers effect finish the checkout after its delay', () => {
    vi.useFakeTimers();
    dispatcher.dispatch(cartEvents.added('Signal Forms'));
    dispatcher.dispatch(cartEvents.checkoutStarted());

    vi.advanceTimersByTime(899);
    expect(store.checkingOut()).toBe(true);

    vi.advanceTimersByTime(1);

    expect(store.checkingOut()).toBe(false);
    expect(store.lines()).toEqual([]);
    expect(store.orderNumber()).toBeGreaterThanOrEqual(1000);
    expect(store.log()[0]).toBe(`order ${store.orderNumber()} placed`);
  });

  it('reduces a directly dispatched checkoutFinished event', () => {
    dispatcher.dispatch(cartEvents.added('Signal Forms'));
    dispatcher.dispatch(cartEvents.checkoutFinished(4711));

    expect(store.orderNumber()).toBe(4711);
    expect(store.checkingOut()).toBe(false);
    expect(store.lines()).toEqual([]);
    expect(store.log()[0]).toBe('order 4711 placed');
  });
});
