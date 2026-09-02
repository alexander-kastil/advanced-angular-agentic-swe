import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { scan } from 'rxjs/operators';
import { WatchlistStore } from './watchlist.store';

@Component({
  selector: 'app-store-composition',
  imports: [FormsModule],
  providers: [WatchlistStore],
  templateUrl: './store-composition.component.html',
  styleUrl: './store-composition.component.scss',
})
export class StoreCompositionComponent {
  protected store = inject(WatchlistStore);
  protected readonly newSymbol = signal('');
  protected readonly selectionChanges = toSignal(this.store.selected$.pipe(scan((count) => count + 1, -1)), {
    initialValue: 0,
  });

  protected addSymbol() {
    this.store.watch(this.newSymbol());
    this.newSymbol.set('');
  }
}
