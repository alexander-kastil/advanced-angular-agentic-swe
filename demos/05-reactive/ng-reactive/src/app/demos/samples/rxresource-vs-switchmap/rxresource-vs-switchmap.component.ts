import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { Skill } from '../../skills/skills';
import { SkillsService } from '../../skills/skills.service';

@Component({
  selector: 'app-http-with-rxjs',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatFormField, MatLabel, MatInput, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './http-with-rxjs.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpWithRxjsComponent {
  private skillsService = inject(SkillsService);

  protected loading = false;
  protected filter = new FormControl('', { nonNullable: true });

  // shareReplay(1) caches the last HTTP result — avoids duplicate requests on re-subscribe
  private allSkills$ = this.skillsService.getSkills().pipe(shareReplay(1));

  // debounceTime + distinctUntilChanged reduce API noise
  // switchMap cancels the previous inner Observable on each new emission
  protected skills$: Observable<Skill[]> = this.filter.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.loading = true),
    switchMap(term =>
      this.allSkills$.pipe(
        switchMap(skills => of(skills.filter(s => s.name.toLowerCase().includes(term.toLowerCase())))),
        catchError(() => of([]))
      )
    ),
    tap(() => this.loading = false),
  );
}
