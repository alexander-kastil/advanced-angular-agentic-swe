import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-debounced-search',
  templateUrl: './debounced-search.component.html',
  styleUrls: ['./debounced-search.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebouncedSearchComponent {
  searchTerm: FormControl = new FormControl('');

  searched = this.searchTerm.valueChanges.pipe(
    debounceTime(750),
    tap((val) => {
      console.log('searched for', val)
    }),
  );
}
