import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DemoItem } from '../../demo-base/demo-item.model';
import { DemoService } from '../../demo-base/demo.service';
import { AsyncPipe } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
    selector: 'app-action-streams',
    templateUrl: './action-streams.component.html',
    styleUrls: ['./action-streams.component.scss'],
    standalone: true,
    imports: [
        MatToolbar,
        MatToolbarRow,
        MatFormField,
        MatInput,
        FormsModule,
        ReactiveFormsModule,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        AsyncPipe,
    ],
})
export class ActionStreamsComponent implements OnInit {
  ds: DemoService = inject(DemoService);
  // Data Stream
  demosData$: Observable<DemoItem[]> = this.ds.getItems();
  // Action Stream
  filter = new FormControl('');

  // Stream to bind the view to
  // Allways make sure to take combineLatest from rxjs and NOT rxjs/operators!!!!
  demos$ = combineLatest([
    this.demosData$,
    this.filter.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([demos, filter]) => {
      console.log(demos);
      return filter != null && filter !== ''
        ? demos.filter((d) =>
          d.title.toLowerCase().includes(filter.toLowerCase())
        )
        : demos;
    })
  );

  ngOnInit() { }
}
