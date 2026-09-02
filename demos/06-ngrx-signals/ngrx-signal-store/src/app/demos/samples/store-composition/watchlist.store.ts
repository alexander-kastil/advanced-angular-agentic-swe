import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { QuoteService } from './quote.service';
import { withAudit } from './with-audit';

type WatchlistState = {
  desk: string;
  symbols: string[];
  selected: string;
  quote: number;
};

export const WatchlistStore = signalStore(
  withState<WatchlistState>({
    desk: 'Vienna Desk',
    symbols: ['NGRX', 'SGNL', 'ZONE', 'RXJS'],
    selected: 'NGRX',
    quote: 0,
  }),
  withProps(({ selected }) => ({
    quotes: inject(QuoteService),
    selected$: toObservable(selected),
  })),
  withFeature((store) => withAudit(store.desk)),
  withComputed(({ symbols }) => ({
    watched: computed(() => symbols().length),
  })),
  withMethods((store) => ({
    refreshQuote: signalMethod<string>((symbol) => {
      const quote = store.quotes.quote(symbol);
      patchState(store, { quote });
      store.audit(`${symbol} quoted at ${quote}`);
    }),
    select(selected: string) {
      patchState(store, { selected });
    },
    watch(symbol: string) {
      const next = symbol.trim().toUpperCase();
      if (!next || store.symbols().includes(next)) {
        return;
      }
      patchState(store, { symbols: [...store.symbols(), next], selected: next });
      store.audit(`${next} added to the watchlist`);
    },
  })),
  withHooks({
    onInit(store) {
      store.refreshQuote(store.selected);
    },
  })
);
