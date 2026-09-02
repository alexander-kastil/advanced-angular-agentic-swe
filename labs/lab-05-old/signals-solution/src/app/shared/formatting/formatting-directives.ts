import { Directive } from '@angular/core';

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

@Directive({
  selector: '[border]',
  host: { 'style': 'border:1px solid var(--color-accent); padding: var(--gap-medium)' },
  standalone: true
})
export class BorderDirective {
}

@Directive({
  selector: '[bold]',
  host: { 'style': 'font-weight:bold;' },
  standalone: true
})
export class FontBoldDirective {
}

@Directive({
  selector: '[height-medium]',
  host: { 'style': 'height:100px;' },
  standalone: true,
  hostDirectives: [BorderDirective]
})
export class HeightDirective {
}

@Directive({
  selector: '[full-width]',
  host: { style: 'width:100%;' },
  hostDirectives: [HeightDirective],
  standalone: true,
})
export class WidthDirective {
}

@Directive({
  selector: '[boxed]',
  standalone: true,
  hostDirectives: [
    FontBoldDirective,
    WidthDirective,
    BorderDirective
  ],
})
export class BoxedDirective {
}

@Directive({
  selector: '[clickable]',
  standalone: true,
  host: { 'style': 'cursor:pointer;' },
})
export class ClickableDirective {
}
