import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  ElementRef,
  ViewContainerRef,
  Component,
  createComponent,
  inject,
  inputBinding,
  outputBinding,
  signal,
  twoWayBinding,
  viewChild,
} from '@angular/core';
import { CounterCardComponent } from './counter-card/counter-card.component';
import { InfoCardComponent } from './info-card/info-card.component';
import { WarningCardComponent } from './warning-card/warning-card.component';

@Component({
  selector: 'app-dynamic-components',
  templateUrl: './dynamic-components.component.html',
  styleUrl: './dynamic-components.component.scss',
})
export class DynamicComponentsComponent {
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  private readonly host = viewChild.required('host', { read: ViewContainerRef });
  private readonly boundHost = viewChild.required('boundHost', { read: ViewContainerRef });
  private readonly detachedHost = viewChild.required<ElementRef<HTMLElement>>('detachedHost');

  private detached: ComponentRef<CounterCardComponent> | null = null;

  readonly created = signal(0);

  readonly headline = signal('bound by inputBinding');
  readonly clicks = signal(0);
  readonly lastReset = signal('never');
  readonly detachedAttached = signal(false);

  addInfo() {
    const ref = this.host().createComponent(InfoCardComponent);
    ref.setInput('message', `created at ${new Date().toLocaleTimeString()}`);
    this.created.update((n) => n + 1);
  }

  addWarning() {
    const ref = this.host().createComponent(WarningCardComponent);
    ref.setInput('message', `created at ${new Date().toLocaleTimeString()}`);
    this.created.update((n) => n + 1);
  }

  removeLast() {
    const container = this.host();
    if (container.length) {
      container.remove(container.length - 1);
      this.created.update((n) => n - 1);
    }
  }

  clear() {
    this.host().clear();
    this.created.set(0);
  }

  addBound() {
    this.boundHost().createComponent(CounterCardComponent, {
      bindings: [
        inputBinding('label', this.headline),
        twoWayBinding('count', this.clicks),
        outputBinding<number>('reset', (value) => {
          this.clicks.set(0);
          this.lastReset.set(`reset from ${value} at ${new Date().toLocaleTimeString()}`);
        }),
      ],
    });
  }

  clearBound() {
    this.boundHost().clear();
  }

  attachDetached() {
    if (this.detached) {
      return;
    }
    this.detached = createComponent(CounterCardComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: this.detachedHost().nativeElement,
      bindings: [inputBinding('label', () => 'created outside the view')],
    });
    this.appRef.attachView(this.detached.hostView);
    this.detachedAttached.set(true);
  }

  destroyDetached() {
    this.detached?.destroy();
    this.detached = null;
    this.detachedAttached.set(false);
  }
}
