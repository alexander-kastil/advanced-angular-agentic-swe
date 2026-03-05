import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LibraryLoaderService {
    private mermaidLoaded = false;
    private prismJsCssLoaded = false;

    async loadMermaid() {
        if (this.mermaidLoaded) {
            return;
        }
        const mermaid = await import('mermaid');
        mermaid.default.initialize({ startOnLoad: true, theme: 'dark' });
        this.mermaidLoaded = true;
    }

    async loadPrismJsTheme() {
        if (this.prismJsCssLoaded) {
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/theme/prism-okaidia.min.css';
        document.head.appendChild(link);
        this.prismJsCssLoaded = true;
    }
}
