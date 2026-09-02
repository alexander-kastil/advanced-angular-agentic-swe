import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-router-bindings',
  templateUrl: './router-bindings.component.html',
  styleUrls: ['./router-bindings.component.scss'],
  imports: [MarkdownRendererComponent, JsonPipe],
})
export class RouterBindingsComponent {
  private router = inject(Router);

  readonly q = input('', { transform: (value: string | undefined) => value ?? '' });
  readonly page = input(1, { transform: (value: string | number | undefined) => Number(value) || 1 });
  readonly showRecent = input(true, {
    transform: (value: string | boolean | undefined) => value !== 'false' && value !== false,
  });

  readonly queryState = computed(() => ({
    q: this.q(),
    page: this.page(),
    showRecent: this.showRecent(),
  }));

  onSearch(value: string) {
    this.navigate({ q: value || undefined, page: 1 });
  }

  nextPage() {
    this.navigate({ page: this.page() + 1 });
  }

  previousPage() {
    this.navigate({ page: Math.max(1, this.page() - 1) });
  }

  toggleRecent() {
    this.navigate({ showRecent: this.showRecent() ? 'false' : undefined });
  }

  clear() {
    this.router.navigate([], { queryParams: {} });
  }

  private navigate(queryParams: Record<string, unknown>) {
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
}
