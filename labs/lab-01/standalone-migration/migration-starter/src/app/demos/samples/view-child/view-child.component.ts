import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-view-child',
  templateUrl: './view-child.component.html',
  styleUrls: ['./view-child.component.scss'],
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
