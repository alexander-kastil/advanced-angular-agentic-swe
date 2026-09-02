import { Component, inject, signal } from '@angular/core';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { Dispatcher, EventScope, injectDispatch, provideDispatcher } from '@ngrx/signals/events';
import { cartEvents } from './cart.events';
import { CartStore } from './cart.store';

@Component({
  selector: 'app-store-events',
  imports: [ProgressBarComponent],
  providers: [provideDispatcher(), CartStore],
  templateUrl: './store-events.component.html',
  styleUrl: './store-events.component.scss',
})
export class StoreEventsComponent {
  protected store = inject(CartStore);
  protected dispatch = injectDispatch(cartEvents);
  protected dispatcher = inject(Dispatcher);
  protected readonly catalog = ['Signals Workshop', 'SignalStore Deep Dive', 'Zoneless Migration', 'Signal Forms'];
  protected readonly scopes: EventScope[] = ['self', 'parent', 'global'];
  protected readonly scope = signal<EventScope>('self');

  protected addScoped(item: string) {
    this.dispatcher.dispatch(cartEvents.added(item), { scope: this.scope() });
  }
}
