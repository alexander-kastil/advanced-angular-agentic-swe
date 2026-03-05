import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from "@angular/cdk/scrolling";
import { Component, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MarkdownRendererComponent } from "../../../shared/markdown-renderer/markdown-renderer.component";

@Component({
  selector: "app-virtual-scroll",
  templateUrl: "./virtual-scroll.component.html",
  styleUrls: ["./virtual-scroll.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownRendererComponent, MatCard, MatCardHeader, MatCardTitle, MatCardContent, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf]
})
export class VirtualScrollComponent {
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);

  @ViewChild(CdkVirtualScrollViewport, { static: true })
  readonly viewport!: CdkVirtualScrollViewport;

  handler(evt: any) { }
}
