import { Directive, ElementRef, inject, signal } from '@angular/core';

@Directive({
  selector: '[appSplitter]',
  host: {
    role: 'separator',
    'aria-orientation': 'vertical',
    tabindex: '0',
    '[attr.aria-valuenow]': 'width()',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-valuemax]': 'max',
    '(pointerdown)': 'start($event)',
    '(keydown.arrowleft)': 'nudge(-24)',
    '(keydown.arrowright)': 'nudge(24)',
  },
})
export class Splitter {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly min = 240;
  protected readonly max = 640;

  readonly width = signal(320);

  start(event: PointerEvent): void {
    event.preventDefault();
    const pane = this.host.nativeElement.previousElementSibling as HTMLElement | null;
    if (!pane) return;

    const origin = event.clientX;
    const initial = this.width();

    const move = (moved: PointerEvent) => this.set(initial + moved.clientX - origin);
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  }

  nudge(delta: number): void {
    this.set(this.width() + delta);
  }

  private set(value: number): void {
    this.width.set(Math.min(this.max, Math.max(this.min, Math.round(value))));
  }
}
