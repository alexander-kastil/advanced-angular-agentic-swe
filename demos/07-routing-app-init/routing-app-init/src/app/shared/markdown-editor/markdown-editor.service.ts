import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MarkdownItem } from './markdown.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MarkdownEditorService {
    private http = inject(HttpClient);
    private url = environment.api + 'comments';

    saveComment(item: MarkdownItem) {
        if (item.id === undefined || item.id === 0) {
            return this.http.post<MarkdownItem>(this.url, item);
        } else {
            return this.http.put<MarkdownItem>(`${this.url}/${item.id}`, item);
        }
    }

    deleteComment(item: MarkdownItem) {
        return this.http.delete<MarkdownItem>(`${this.url}/${item.id}`);
    }

    getComments() {
        return this.http.get<MarkdownItem[]>(this.url);
    }

    getComment(id: number) {
        return this.http.get<MarkdownItem>(`${this.url}/${id}`);
    }
}
