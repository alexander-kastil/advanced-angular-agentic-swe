import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { Component, afterNextRender, computed, signal, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';

interface Row {
  id: number;
  label: string;
  score: number;
}

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, DecimalPipe]
})
export class VirtualScrollComponent {
  readonly viewport = viewChild.required(CdkVirtualScrollViewport);

  readonly itemSize = 56;
  readonly items: Row[] = Array.from({ length: 100000 }, (_, index) => ({
    id: index,
    label: `Item #${index}`,
    score: (index * 37) % 100
  }));

  readonly range = signal({ start: 0, end: 0 });
  readonly rendered = computed(() => this.range().end - this.range().start);

  constructor() {
    afterNextRender(() => this.syncRange());
  }

  syncRange() {
    this.range.set(this.viewport().getRenderedRange());
  }

  jumpToEnd() {
    this.viewport().scrollToIndex(this.items.length - 1, 'smooth');
  }
}
