import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { CatalogStore } from './catalog.store';

@Component({
  selector: 'app-route-driven-store',
  templateUrl: './route-driven-store.component.html',
  styleUrls: ['./route-driven-store.component.scss'],
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
  ],
})
export class RouteDrivenStoreComponent {
  private router = inject(Router);

  readonly store = inject(CatalogStore);

  readonly category = input<string | undefined>('all');
  readonly q = input<string | undefined>('');

  private readonly routeFilter = computed(() => ({
    category: this.category() ?? 'all',
    q: this.q() ?? '',
  }));

  constructor() {
    this.store.applyRouteFilter(this.routeFilter);
  }

  selectCategory(category: string) {
    this.router.navigate(['/demos/route-driven-store', category], {
      queryParamsHandling: 'preserve',
    });
  }

  search(value: string) {
    this.router.navigate([], {
      queryParams: { q: value || undefined },
      queryParamsHandling: 'merge',
    });
  }
}
