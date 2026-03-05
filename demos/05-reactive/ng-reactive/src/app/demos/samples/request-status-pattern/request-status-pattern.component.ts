import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatProgressBar } from '@angular/material/progress-bar';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Skill } from '../../skills/skills';
import { SkillsService } from '../../skills/skills.service';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface State {
  status: RequestStatus;
  data: Skill[];
  error: string | null;
}

@Component({
  selector: 'app-request-status-pattern',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton, MatProgressBar, MatChipSet, MatChip, AsyncPipe],
  templateUrl: './request-status-pattern.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestStatusPatternComponent {
  private skillsService = inject(SkillsService);

  private state$ = new BehaviorSubject<State>({ status: 'idle', data: [], error: null });

  protected status$ = this.state$.pipe(map(s => s.status));
  protected data$ = this.state$.pipe(map(s => s.data));
  protected error$ = this.state$.pipe(map(s => s.error));

  protected load() {
    this.state$.next({ status: 'loading', data: [], error: null });
    this.skillsService.getSkills().pipe(
      finalize(() => {
        if (this.state$.value.status === 'loading') {
          this.state$.next({ ...this.state$.value, status: 'error', error: 'Unknown error' });
        }
      }),
      catchError(err => {
        this.state$.next({ status: 'error', data: [], error: err.message ?? 'Failed to load' });
        return of([]);
      })
    ).subscribe(data => {
      if (data.length > 0) {
        this.state$.next({ status: 'success', data, error: null });
      }
    });
  }
}
