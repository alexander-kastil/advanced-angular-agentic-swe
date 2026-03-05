import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Topic } from './topic.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private httpClient: HttpClient) { }

  getTopics(): Observable<Topic[]> {
    return this.httpClient
      .get<Topic[]>(environment.api + 'topics')
      .pipe(tap((data) => console.log('data from api', data)));
  }

  getTopic(id: number): Observable<Topic> {
    return this.httpClient.get<Topic>(environment.api + 'topics' + id);
  }

  insertTopic(Topic: Topic): Observable<any> {
    return this.httpClient.post<Topic>(environment.api + 'topics', Topic);
  }

  insertTopicSlow(Topic: Topic): Observable<any> {
    return this.httpClient.post<Topic>(environment.api + 'topics', Topic);
  }

  updateTopic(Topic: Topic): Observable<any> {
    return this.httpClient.put<Topic>(environment.api + 'topics', Topic);
  }

  deleteTopic(id: number): Observable<any> {
    return this.httpClient.delete(environment.api + 'topics' + id);
  }
}
