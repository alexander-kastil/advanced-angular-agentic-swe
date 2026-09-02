import { Component, computed, declareExperimentalWebMcpTool, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Book, formatList, initialBooks } from './reading-list';

@Component({
  selector: 'app-webmcp-e2e',
  imports: [MatCardModule],
  template: `
    <div class="grid">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Reading list</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div data-testid="bridge">
            {{ bridgeAvailable() ? 'WebMCP bridge detected' : 'No WebMCP bridge in this browser' }}
          </div>
          @for (book of books(); track book.title) {
            <div data-testid="book-row" [class.read]="book.read">
              {{ book.read ? '[read]' : '[open]' }} {{ book.title }} - {{ book.author }}
            </div>
          }
          <div data-testid="open-count">{{ openCount() }} still open</div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Tools this page exposes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>
            Declared with <code>declareExperimentalWebMcpTool</code>. An agent, or a Playwright test
            standing in for one, calls them instead of clicking.
          </p>
          @for (tool of toolNames; track tool) {
            <div data-testid="tool-name">{{ tool }}</div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    mat-card { max-width: 30rem; }
    .read { opacity: .6; }
  `],
})
export class WebmcpE2eComponent {
  readonly toolNames = ['list_reading_list', 'add_book', 'mark_read'];

  readonly books = signal<Book[]>(initialBooks.map((b) => ({ ...b })));
  readonly openCount = computed(() => this.books().filter((b) => !b.read).length);
  readonly bridgeAvailable = signal(this.hasBridge());

  constructor() {
    void declareExperimentalWebMcpTool({
      name: 'list_reading_list',
      description: 'Lists every book on the reading list with its read state.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => formatList(this.books()),
    });

    void declareExperimentalWebMcpTool({
      name: 'add_book',
      description: 'Adds a book to the reading list.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The book title' },
          author: { type: 'string', description: 'The author of the book' },
        },
        required: ['title', 'author'],
      },
      execute: ({ title, author }) => {
        if (this.books().some((b) => b.title === title)) {
          return `${title} is already on the list.`;
        }
        this.books.update((all) => [...all, { title, author, read: false }]);
        return `Added ${title} by ${author}.`;
      },
    });

    void declareExperimentalWebMcpTool({
      name: 'mark_read',
      description: 'Marks a book on the reading list as read.',
      inputSchema: {
        type: 'object',
        properties: { title: { type: 'string', description: 'The book title' } },
        required: ['title'],
      },
      execute: ({ title }) => {
        if (!this.books().some((b) => b.title === title)) {
          return `${title} is not on the reading list.`;
        }
        this.books.update((all) => all.map((b) => (b.title === title ? { ...b, read: true } : b)));
        return `Marked ${title} as read.`;
      },
    });
  }

  private hasBridge(): boolean {
    const context =
      (document as unknown as { modelContext?: unknown }).modelContext ??
      (navigator as unknown as { modelContext?: unknown }).modelContext;
    return context !== undefined;
  }
}
