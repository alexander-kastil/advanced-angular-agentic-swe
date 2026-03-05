import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommentItem } from './comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  http = inject(HttpClient);
  url = environment.api + 'comments';

  saveComment(item: CommentItem) {
    if (item.id === undefined || item.id === 0) {
      return this.http.post<CommentItem>(this.url, item);
    } else {
      return this.http.put<CommentItem>(`${this.url}/${item.id}`, item);
    }
  }

  deleteComment(item: CommentItem) {
    return this.http.delete<CommentItem>(`${this.url}/${item.id}`);
  }

  getComments() {
    return this.http.get<CommentItem[]>(this.url);
  }

  getComment(id: number) {
    return this.http.get<CommentItem>(`${this.url}/${id}`);
  }
}
