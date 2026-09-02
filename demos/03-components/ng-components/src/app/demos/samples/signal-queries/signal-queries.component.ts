import { Component, ElementRef, computed, signal, viewChild, viewChildren } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { QueryPanelComponent } from './query-panel/query-panel.component';
import { StatusBadgeComponent } from './status-badge/status-badge.component';

@Component({
  selector: 'app-signal-queries',
  templateUrl: './signal-queries.component.html',
  styleUrl: './signal-queries.component.scss',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    QueryPanelComponent,
    StatusBadgeComponent,
  ],
})
export class SignalQueriesComponent {
  readonly liters = viewChild.required<ElementRef<HTMLInputElement>>('liters');
  readonly cost = viewChild.required<ElementRef<HTMLInputElement>>('cost');
  readonly fields = viewChildren<ElementRef<HTMLInputElement>>('field');
  readonly badge = viewChild.required(StatusBadgeComponent);

  readonly fieldCount = computed(() => this.fields().length);
  readonly lastAction = signal('nothing yet');

  calculate() {
    const liters = Number(this.liters().nativeElement.value);
    const total = (liters * 1.25).toFixed(2);
    this.cost().nativeElement.value = total;
    this.lastAction.set(`viewChild.required wrote ${total} into #cost`);
  }

  tagFields() {
    this.fields().forEach((field, index) => {
      field.nativeElement.placeholder = `field ${index + 1}`;
    });
    this.badge().pulse(`${this.fieldCount()} fields tagged`);
    this.lastAction.set('viewChildren walked every #field element');
  }
}
