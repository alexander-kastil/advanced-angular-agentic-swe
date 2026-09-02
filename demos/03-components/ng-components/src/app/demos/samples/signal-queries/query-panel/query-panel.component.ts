import { Component, ElementRef, computed, contentChild, contentChildren, signal } from '@angular/core';

@Component({
  selector: 'app-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrl: './query-panel.component.scss',
})
export class QueryPanelComponent {
  readonly headline = contentChild<ElementRef<HTMLElement>>('headline');
  readonly entries = contentChildren<ElementRef<HTMLElement>>('entry');

  readonly entryCount = computed(() => this.entries().length);
  readonly collected = signal<string[]>([]);

  readTexts() {
    this.collected.set(
      this.entries().map((entry) => entry.nativeElement.textContent?.trim() ?? '')
    );
  }

  readHeadline() {
    return this.headline()?.nativeElement.textContent?.trim() ?? 'no headline projected';
  }
}
