import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay } from 'rxjs/operators';
import { TaskItem } from './task-item.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  http = inject(HttpClient);

  getTasks() {
    return this.http
      .get<TaskItem[]>('http://localhost:3000/tasks')
      .pipe(
        delay(1000)
      );
  }
}
