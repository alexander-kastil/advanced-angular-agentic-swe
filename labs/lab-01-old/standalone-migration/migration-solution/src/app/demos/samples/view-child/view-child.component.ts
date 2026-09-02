import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-view-child',
    templateUrl: './view-child.component.html',
    styleUrls: ['./view-child.component.scss'],
    standalone: true,
    imports: [
        MarkdownRendererComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
    ],
})
export class ViewChildComponent {
  @ViewChild('liters') nbrLiters: ElementRef | null = null;
  @ViewChild('cost') nbrCost: ElementRef | null = null;
  @ViewChildren('input') inputs: QueryList<ElementRef> | null = null;

  ngAfterViewInit(): void {
    // notice the use of ViewChildren
    console.log("viewchildren:", this.inputs);
  }

  calculateCost() {
    const cost = this.nbrLiters?.nativeElement.value * 1.9;
    if (this.nbrCost) {
      this.nbrCost.nativeElement.value = cost;
    }
  }
}
