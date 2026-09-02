import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { scan } from 'rxjs/operators';
import { WatchlistStore } from './watchlist.store';

@Component({
  selector: 'app-store-composition',
  imports: [FormsModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatFormField, MatLabel, MatInput, MatButton],
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
