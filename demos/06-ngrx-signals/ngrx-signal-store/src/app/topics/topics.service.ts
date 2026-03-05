import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Topic } from './topic.model';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  client = inject(HttpClient);

  getTopics() {
    return this.client.get<Topic[]>(environment.api + 'topics');
  }

  updateTopic(topic: Topic) {
    return this.client.put<Topic>(environment.api + 'topics/' + topic.id, topic).pipe(
      delay(1000)
    );
  }
}
