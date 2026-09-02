import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { uxButtonComponent } from './ux-button/ux-button.component';
import { uxSplitComponent } from './ux-split/ux-split.component';
import { MatButtonModule } from '@angular/material/button';
import { ColumnDirective, RowDirective, GapDirective, CenteredDirective, BorderDirective, HeightDirective, WidthDirective, BoxedDirective } from './formatting/formatting-directives';

@NgModule({
  declarations: [
    uxButtonComponent,
    uxSplitComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
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
    uxButtonComponent,
    uxSplitComponent,
    ColumnDirective,
    RowDirective,
    GapDirective,
    CenteredDirective,
    BorderDirective,
    HeightDirective,
    WidthDirective,
    BoxedDirective
  ],
})
export class UxLibModule { }
