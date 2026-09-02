import { httpResource } from '@angular/common/http';
import { Component, computed, debounced, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { environment } from '../../../../environments/environment';
import { BorderDirective } from '../../../shared/formatting/formatting-directives';
import { Skill } from '../../../skills/skill.model';

@Component({
  selector: 'app-debounced-search',
  imports: [MatFormField, MatLabel, MatInput, BorderDirective],
  templateUrl: './debounced-search.component.html',
  styleUrl: './debounced-search.component.scss',
})
export class DebouncedSearchComponent {
  readonly term = signal('', { debugName: 'term' });
  readonly debouncedTerm = debounced(this.term, 400);
  readonly settling = computed(() => this.debouncedTerm.isLoading());

  readonly results = httpResource<Skill[]>(
    () => {
      const term = this.debouncedTerm.value().trim();
      return term
        ? `${environment.api}skills?name_like=${encodeURIComponent(term)}`
        : `${environment.api}skills`;
    },
    { defaultValue: [], debugName: 'searchResults' },
  );

  onInput(event: Event) {
    this.term.set((event.target as HTMLInputElement).value);
  }
}
