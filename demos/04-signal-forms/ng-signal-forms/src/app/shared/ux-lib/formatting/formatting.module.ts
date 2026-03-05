import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorderDirective, BoxedDirective, ColumnDirective } from './formatting-directives';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BoxedDirective,
    BorderDirective,
    ColumnDirective
  ]
})
export class FormattingModule { }
