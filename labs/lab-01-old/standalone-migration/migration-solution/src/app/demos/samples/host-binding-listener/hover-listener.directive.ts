import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[hoverListener]',
    standalone: true,
})
export class HoverListenerDirective {
  @HostListener('mouseover') onHover() {
    this.wasHovered++;
    console.log('hovering');
  }

  @HostBinding('attr.wasHovered') wasHovered = 0;

  constructor() {}
}
