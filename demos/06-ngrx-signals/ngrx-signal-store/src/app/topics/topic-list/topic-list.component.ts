import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { Topic } from '../topic.model';
import { topicsStore } from '../topics.store';

@Component({
  selector: 'app-topic-list',
  imports: [
    MatTableModule,
    MatSlideToggleModule,
    MatProgressBarModule
  ],
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
  providers: [topicsStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopicListComponent {
  store = inject(topicsStore);
  topics = this.store.entities;

  toggleCompleted(topic: Topic) {
    this.store.updateTopic({ ...topic, completed: !topic.completed });
  }
}
