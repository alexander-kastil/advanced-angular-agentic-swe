import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from "@angular/cdk/scrolling";
import { Component, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";

@Component({
  selector: "app-virtual-scroll",
  templateUrl: "./virtual-scroll.component.html",
  styleUrls: ["./virtual-scroll.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf]
})
export class VirtualScrollComponent {
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);

  @ViewChild(CdkVirtualScrollViewport, { static: true })
  readonly viewport!: CdkVirtualScrollViewport;

  handler(evt: any) { }
}
