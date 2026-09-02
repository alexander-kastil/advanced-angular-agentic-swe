import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[column]',
  host: {
    'style': `
    display: flex;
    flex-direction: column;
    `},
  standalone: true
})
export class ColumnDirective {
}

@Directive({
  selector: '[row]',
  host: {
    'style': `
    display: flex;
    flex-direction: row;
    `},
  standalone: true
})
export class RowDirective {
}

@Directive({
  selector: '[rowgap]',
  host: {
    'style': `
      display: flex;
      flex-direction: row;
      gap: var(--gap-medium);
    `},
  standalone: true
})
export class GapDirective {
}

@Directive({
  selector: '[centered]',
  host: {
    'style': `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `},
  standalone: true
})
export class CenteredDirective {
}
