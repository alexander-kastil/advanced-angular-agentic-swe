import { Directive } from '@angular/core';

@Directive({
  selector: '[column]',
  host: {
    'style': `
    display: flex;
    flex-direction: column;
    gap: var(--gap-medium);
    `}
})
export class ColumnDirective {
}

@Directive({
  selector: '[row]',
  host: {
    'style': `
    display: flex;
    flex-direction: row;
    gap: var(--gap-medium);
    `}
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
    `}
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
    `}
})
export class CenteredDirective {
}

@Directive({
  selector: '[border]',
  host: { 'style': 'border:1px solid var(--color-accent); padding: var(--gap-medium)' }
})
export class BorderDirective {
}

@Directive({
  selector: '[bottom-margin]',
  host: { 'style': 'margin-bottom: var(--gap-small)' }
})
export class BottomMarginDirective {
}

@Directive({
  selector: '[bold]',
  host: { 'style': 'font-weight:bold;' }
})
export class FontBoldDirective {
}

@Directive({
  selector: '[height-medium]',
  host: { 'style': 'min-height:100px;' },
  hostDirectives: [BorderDirective]
})
export class HeightDirective {
}

@Directive({
  selector: '[full-width]',
  host: { style: 'width:100%;' },
  hostDirectives: [HeightDirective],
})
export class WidthDirective {
}

@Directive({
  selector: '[boxed]',
  hostDirectives: [
    BorderDirective,
    BottomMarginDirective,
    ColumnDirective
  ],
})
export class BoxedDirective {
}
