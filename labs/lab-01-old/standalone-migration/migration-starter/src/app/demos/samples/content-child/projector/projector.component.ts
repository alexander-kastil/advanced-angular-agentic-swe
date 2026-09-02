import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-projector',
  templateUrl: './projector.component.html',
  styleUrls: ['./projector.component.scss'],
})
export class ProjectorComponent implements AfterContentInit {
  @ContentChild('comment') divComment: ElementRef | null = null;

  ngAfterContentInit(): void {
    console.log('the comment: ', this.divComment?.nativeElement);
  }
}
