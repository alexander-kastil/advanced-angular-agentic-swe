import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MarkdownItem } from './markdown.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MarkdownEditorService {
    private http = inject(HttpClient);
    private url = environment.api + 'markdownItems';

    saveMarkdownItem(item: MarkdownItem) {
        const payload = { ...item, saved: new Date().toISOString() };
        if (item.id === undefined || item.id === 0) {
            return this.http.post<MarkdownItem>(this.url, payload);
        } else {
            return this.http.put<MarkdownItem>(`${this.url}/${item.id}`, payload);
        }
    }

    deleteMarkdownItem(item: MarkdownItem) {
        return this.http.delete<MarkdownItem>(`${this.url}/${item.id}`);
    }

    getMarkdownItems() {
        return this.http.get<MarkdownItem[]>(this.url);
    }

    getMarkdownItem(id: number) {
        return this.http.get<MarkdownItem>(`${this.url}/${id}`);
    }

    getMarkdownContent(src: string) {
        return this.http.get(`${environment.markdownPath}${src}.md`, { responseType: 'text' });
    }
}
