import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appCapitalize]'
})
export class CapitalizeDirective {
  el = inject(ElementRef);
  renderer = inject(Renderer2);

  @HostListener('click') onClick() {
    this.el.nativeElement.style.textTransform === 'uppercase'
      ? (this.el.nativeElement.style.textTransform = 'lowercase')
      : (this.el.nativeElement.style.textTransform = 'uppercase');
  }
}
