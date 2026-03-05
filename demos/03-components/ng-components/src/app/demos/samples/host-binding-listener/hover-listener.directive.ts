import { Directive, signal } from '@angular/core';

@Directive({
  selector: '[hoverListener]',
  standalone: true,
  host: {
    '(mouseover)': 'onHover()',
    '[attr.wasHovered]': 'wasHovered()'
  }
})
export class HoverListenerDirective {
  protected wasHovered = signal(0);

  onHover() {
    this.wasHovered.update(v => v + 1);
    console.log('hovering');
  }
}
