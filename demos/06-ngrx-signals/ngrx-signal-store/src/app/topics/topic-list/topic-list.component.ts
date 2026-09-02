import { Component, inject } from '@angular/core';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { SlideToggleComponent } from '../../shared/slide-toggle/slide-toggle.component';
import { Topic } from '../topic.model';
import { topicsStore } from '../topics.store';

@Component({
  selector: 'app-topic-list',
  imports: [ProgressBarComponent, SlideToggleComponent],
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
  providers: [topicsStore],
})
export class TopicListComponent {
  store = inject(topicsStore);
  topics = this.store.entities;

  toggleCompleted(topic: Topic) {
    this.store.updateTopic({ ...topic, completed: !topic.completed });
  }
}
