export interface Book {
  title: string;
  author: string;
  read: boolean;
}

export const initialBooks: Book[] = [
  { title: 'Refactoring', author: 'Martin Fowler', read: true },
  { title: 'Working Effectively with Legacy Code', author: 'Michael Feathers', read: false },
];

export function formatList(books: Book[]): string {
  if (books.length === 0) {
    return 'The reading list is empty.';
  }
  return books.map((b) => `${b.read ? '[read]' : '[open]'} ${b.title} by ${b.author}`).join('\n');
}
