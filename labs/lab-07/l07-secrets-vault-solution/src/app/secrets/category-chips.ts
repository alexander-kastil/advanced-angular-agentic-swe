import { Component, input, model } from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';
import { Category } from './category';

@Component({
  selector: 'app-category-chips',
  imports: [Listbox, Option],
  template: `
    <div ngListbox multi selectionMode="explicit" orientation="horizontal" [(value)]="selected"
         aria-label="Filter by category">
      @for (category of categories(); track category.categoryId) {
        <span ngOption [value]="category.categoryId" [label]="category.topic" class="chip"
              [style.--chip]="category.color">
          {{ category.topic }}
          <span class="count">{{ category.secretCount }}</span>
        </span>
      }
    </div>
  `,
  styles: `
    div {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
    }
    .chip {
      align-items: center;
      border: 1px solid color-mix(in srgb, var(--chip) 45%, transparent);
      border-radius: 999px;
      color: var(--color-muted-foreground);
      cursor: pointer;
      display: inline-flex;
      font-size: 0.75rem;
      gap: var(--space-md);
      padding: var(--space-sm) var(--space-lg);
      transition: background 200ms, color 200ms;
    }
    .chip[aria-selected='true'] {
      background: color-mix(in srgb, var(--chip) 22%, transparent);
      border-color: var(--chip);
      color: var(--color-foreground);
    }
    .chip:focus-visible {
      outline: 2px solid var(--color-ring);
      outline-offset: 2px;
    }
    .count {
      color: var(--chip);
      font-weight: 600;
    }
  `,
})
export class CategoryChips {
  readonly categories = input.required<Category[]>();
  readonly selected = model<string[]>([]);
}
