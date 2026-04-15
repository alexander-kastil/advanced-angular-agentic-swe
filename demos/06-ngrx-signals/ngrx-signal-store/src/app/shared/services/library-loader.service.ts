import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LibraryLoaderService {
    private mermaidLoaded = false;

    async loadMermaid() {
        if (this.mermaidLoaded) {
            return;
        }
        const mermaid = await import('mermaid');
        mermaid.default.initialize({ startOnLoad: true, theme: 'dark' });
        this.mermaidLoaded = true;
    }
}
