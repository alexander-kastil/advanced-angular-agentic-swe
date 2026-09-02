import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarComponent } from 'src/app/shared/progress-bar/progress-bar.component';
import {
  catchError,
  debounceTime,
  defer,
  distinctUntilChanged,
  finalize,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skill } from '../../skills/skills';

@Component({
  selector: 'app-rxresource-vs-switchmap',
  templateUrl: './rxresource-vs-switchmap.component.html',
  imports: [ProgressBarComponent, FormsModule, ReactiveFormsModule],
  styles: `
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .result { font-family: monospace; font-size: 0.85rem; }
    .meta { display: flex; gap: 12px; font-size: 0.78rem; margin-bottom: 6px; }
    .meta span { padding: 2px 6px; border-radius: 4px; background: #eef2f6; color: #334155; }
    .chain { margin-top: 16px; }
  `,
})
export class RxresourceVsSwitchmapComponent {
  private http = inject(HttpClient);
  private url = `${environment.api}skills`;

  protected classicRequests = signal(0);
  protected classicLoading = signal(false);
  protected classicFailed = signal(false);

  protected classicTerm = new FormControl('', { nonNullable: true });
  protected classicResult = toSignal(
    this.classicTerm.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) =>
        defer(() => {
          this.classicRequests.update((count) => count + 1);
          this.classicLoading.set(true);
          this.classicFailed.set(false);
          return this.http.get<Skill[]>(this.url);
        }).pipe(
          map((skills) => skills.filter((s) => s.name.toLowerCase().includes(term.toLowerCase()))),
          catchError(() => {
            this.classicFailed.set(true);
            return of([] as Skill[]);
          }),
          finalize(() => this.classicLoading.set(false)),
        ),
      ),
    ),
    { initialValue: [] as Skill[] },
  );

  protected resourceRequests = signal(0);
  protected resourceTerm = signal('');
  protected skillsResource = rxResource({
    params: () => this.resourceTerm(),
    stream: ({ params }) =>
      defer(() => {
        this.resourceRequests.update((count) => count + 1);
        return this.http.get<Skill[]>(this.url);
      }).pipe(
        map((skills) => skills.filter((s) => s.name.toLowerCase().includes(params.toLowerCase()))),
      ),
    defaultValue: [],
  });

  protected firstSkillDetail = rxResource({
    params: ({ chain }) => chain(this.skillsResource).at(0)?.id,
    stream: ({ params }) => this.http.get<Skill>(`${this.url}/${params}`),
  });
}
