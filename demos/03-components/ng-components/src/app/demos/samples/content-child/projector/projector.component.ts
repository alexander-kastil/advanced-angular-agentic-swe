import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-projector',
  templateUrl: './projector.component.html',
  styleUrls: ['./projector.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectorComponent implements AfterContentInit {
  @ContentChild('comment') divComment: ElementRef | null = null;

  ngAfterContentInit(): void {
    console.log('the comment: ', this.divComment?.nativeElement);
  }
}
