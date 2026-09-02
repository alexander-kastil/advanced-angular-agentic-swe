import { Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { extendResource, withPreviousValueOnLoading, withValueOnError } from '@ngrx/signals/resource';
import { environment } from '../../../../environments/environment';
import { Topic } from '../../../topics/topic.model';

@Component({
  selector: 'app-store-resource',
  imports: [FormsModule, ProgressBarComponent],
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
