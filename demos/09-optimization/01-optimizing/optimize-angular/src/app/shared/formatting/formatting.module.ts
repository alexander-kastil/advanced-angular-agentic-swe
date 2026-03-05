import { NgModule } from '@angular/core';
import { BorderDirective, BoxedDirective, CenteredDirective, ColumnDirective, GapDirective, HeightDirective, RowDirective, WidthDirective } from './formatting-directives';

@NgModule({
  declarations: [],
  imports: [
    ColumnDirective,
    RowDirective,
    GapDirective,
    CenteredDirective,
    BorderDirective,
    HeightDirective,
    WidthDirective,
    BoxedDirective
  ],
  exports: [
    ColumnDirective,
    RowDirective,
    GapDirective,
    CenteredDirective,
    BorderDirective,
    HeightDirective,
    WidthDirective,
    BoxedDirective
  ]
})
export class FormattingModule { }
