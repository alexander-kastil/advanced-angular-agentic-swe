import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, startWith } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Skill } from '../../../skills/skill.model';
import { BorderDirective, CenteredDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-rxjs-interop',
  imports: [BorderDirective, CenteredDirective],
  templateUrl: './rxjs-interop.component.html',
  styleUrl: './rxjs-interop.component.scss',
})
export class RxjsInteropComponent {
  private http = inject(HttpClient);

  readonly seconds = toSignal(interval(1000).pipe(map((n) => n + 1), startWith(0)), {
    initialValue: 0,
  });

  readonly onlyCompleted = signal(false);
  readonly onlyCompleted$ = toObservable(this.onlyCompleted);
  readonly lastFilter = toSignal(this.onlyCompleted$.pipe(map((v) => (v ? 'completed' : 'all'))), {
    initialValue: 'all',
  });

  readonly skills = rxResource({
    params: () => this.onlyCompleted(),
    stream: ({ params }) =>
      this.http
        .get<Skill[]>(`${environment.api}skills`)
        .pipe(map((list) => (params ? list.filter((s) => s.completed) : list))),
    defaultValue: [],
  });

  toggleFilter() {
    this.onlyCompleted.update((v) => !v);
  }
}
