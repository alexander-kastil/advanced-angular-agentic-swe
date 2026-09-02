import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appCapitalize]',
  host: {
    '(click)': 'onClick()',
  },
})
export class CapitalizeDirective {
  el = inject(ElementRef);

  onClick() {
    this.el.nativeElement.style.textTransform === 'uppercase'
      ? (this.el.nativeElement.style.textTransform = 'lowercase')
      : (this.el.nativeElement.style.textTransform = 'uppercase');
  }
}
