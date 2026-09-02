import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../src/environments/environment';
import { Skill } from '../src/app/demos/skills/skills';

interface SkillsState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: Skill[];
  filter: string;
}

@Injectable({ providedIn: 'root' })
export class SkillsStore {
  private http = inject(HttpClient);

  private state$ = new BehaviorSubject<SkillsState>({
    status: 'idle',
    data: [],
    filter: '',
  });

  readonly status$ = this.state$.pipe(map((state) => state.status));
  readonly data$ = this.state$.pipe(map((state) => state.data));
  readonly filter$ = this.state$.pipe(map((state) => state.filter));

  readonly visible$ = this.state$.pipe(
    map((state) =>
      state.data.filter((skill) =>
        skill.name.toLowerCase().includes(state.filter.toLowerCase()),
      ),
    ),
  );

  setFilter(filter: string) {
    this.state$.next({ ...this.state$.value, filter });
  }

  load() {
    this.state$.next({ ...this.state$.value, status: 'loading' });

    this.http.get<Skill[]>(`${environment.api}skills`).subscribe({
      next: (data) => this.state$.next({ ...this.state$.value, status: 'success', data }),
      error: () => this.state$.next({ ...this.state$.value, status: 'error', data: [] }),
    });
  }

  reload() {
    this.load();
  }
}
