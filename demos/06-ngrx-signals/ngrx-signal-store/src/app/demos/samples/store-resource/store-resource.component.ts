import { Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { extendResource, withPreviousValueOnLoading, withValueOnError } from '@ngrx/signals/resource';
import { environment } from '../../../../environments/environment';
import { Topic } from '../../../topics/topic.model';

@Component({
  selector: 'app-store-resource',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatProgressBar,
  ],
  templateUrl: './store-resource.component.html',
  styleUrl: './store-resource.component.scss',
})
export class StoreResourceComponent {
  protected readonly search = signal('');

  protected readonly topics = extendResource(
    httpResource<Topic[]>(() => {
      const term = this.search().trim();
      return `${environment.api}topics${term ? `?name_like=${encodeURIComponent(term)}` : ''}`;
    }),
    withPreviousValueOnLoading(),
    withValueOnError([] as Topic[])
  );

  protected readonly errorMessage = computed(() => (this.topics.error() as Error | undefined)?.message ?? '');
}
