import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { QuoteService } from './quote.service';
import { WatchlistStore } from './watchlist.store';

class StubQuoteService {
  calls: string[] = [];
  quote(symbol: string): number {
    this.calls.push(symbol);
    return symbol.length * 10 + symbol.charCodeAt(0);
  }
}

describe('WatchlistStore (withProps, withFeature, signalMethod)', () => {
  let store: InstanceType<typeof WatchlistStore>;
  let quotes: StubQuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: QuoteService, useClass: StubQuoteService }, WatchlistStore],
    });
    store = TestBed.inject(WatchlistStore);
    quotes = TestBed.inject(QuoteService) as unknown as StubQuoteService;
  });

  it('exposes the injected service and the derived observable through withProps', () => {
    expect(store.quotes).toBe(quotes);
    expect(typeof store.selected$.subscribe).toBe('function');
  });

  it('runs the signalMethod bound to the selected signal on init', () => {
    TestBed.tick();

    expect(quotes.calls).toEqual(['NGRX']);
    expect(store.quote()).toBe(118);
  });

  it('re-runs the signalMethod when the bound signal changes', () => {
    TestBed.tick();
    store.select('RXJS');
    TestBed.tick();

    expect(quotes.calls).toEqual(['NGRX', 'RXJS']);
    expect(store.quote()).toBe(122);
  });

  it('writes the audit trail supplied by the withFeature-composed feature', () => {
    store.refreshQuote('ZONE');

    expect(store.quote()).toBe(130);
    expect(store.auditLog()[0]).toBe('[Vienna Desk] ZONE quoted at 130');
  });

  it('adds a normalized symbol, selects it and audits it', () => {
    store.watch('  tsla ');

    expect(store.symbols()).toContain('TSLA');
    expect(store.selected()).toBe('TSLA');
    expect(store.watched()).toBe(5);
    expect(store.auditLog()[0]).toBe('[Vienna Desk] TSLA added to the watchlist');
  });

  it('ignores a blank or already watched symbol', () => {
    store.watch('   ');
    store.watch('ngrx');

    expect(store.watched()).toBe(4);
    expect(store.auditLog()).toEqual([]);
  });

  it('clears the audit trail without touching the watchlist', () => {
    store.watch('TSLA');
    store.clearAudit();

    expect(store.auditLog()).toEqual([]);
    expect(store.watched()).toBe(5);
  });
});
