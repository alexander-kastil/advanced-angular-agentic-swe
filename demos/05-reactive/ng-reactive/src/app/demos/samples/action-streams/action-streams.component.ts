import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { DemoService } from '../../demo-container/demo.service';
import { DemoItem } from '../../demo-container/demo-item.model';

@Component({
  selector: 'app-action-streams',
  templateUrl: './action-streams.component.html',
  styleUrls: ['./action-streams.component.scss'],
  imports: [MatFormField, MatInput, FormsModule, ReactiveFormsModule, AsyncPipe, BoxedDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionStreamsComponent {
  ds = inject(DemoService);

  demos$ = this.ds.getDemos();
  filter$ = new FormControl<string>('', { nonNullable: true });

  vm$ = combineLatest([
    this.demos$,
    this.filter$.valueChanges.pipe(startWith('')),
  ] as const).pipe(
    map(([demos, filter]: [DemoItem[], string]) => {
      return filter == ''
        ? demos
        : demos.filter((d: DemoItem) =>
          d.title.toLowerCase().includes(filter.toLowerCase())
        );
    })
  );
}