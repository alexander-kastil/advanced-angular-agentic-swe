import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MarkdownRendererComponent } from '../../shared/markdown-renderer/markdown-renderer.component';
import { OFFLINE_CATALOG_HEADER } from '../../offline-catalog.interceptor';
import { environment } from '../../../environments/environment';
import { DemoItem } from './demo-item.model';

interface DemoGroup {
  topic: string;
  items: DemoItem[];
}

@Component({
  selector: 'app-demo-container',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MarkdownRendererComponent],
  templateUrl: './demo-container.component.html',
  styleUrl: './demo-container.component.scss',
})
export class DemoContainerComponent {
  private readonly router = inject(Router);
  private readonly catalog = httpResource<DemoItem[]>(() => `${environment.api}demos`);

  readonly title = environment.title;
  readonly offline = computed(() => this.catalog.headers()?.has(OFFLINE_CATALOG_HEADER) ?? false);

  readonly demos = computed(() =>
    [...(this.catalog.value() ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
  );

  readonly groups = computed<DemoGroup[]>(() => {
    const groups: DemoGroup[] = [];
    for (const item of this.demos()) {
      const group = groups.find((g) => g.topic === item.topic);
      if (group) {
        group.items.push(item);
      } else {
        groups.push({ topic: item.topic, items: [item] });
      }
    }
    return groups;
  });

  readonly currentUrl = signal(this.router.url);

  readonly currentDemo = computed(() => {
    const segments = this.currentUrl().split('/');
    return this.demos().find((demo) => segments.includes(demo.url)) ?? null;
  });

  readonly header = computed(() => this.currentDemo()?.title ?? 'Please select a demo');
  readonly currentMd = computed(() => this.currentDemo()?.md ?? '');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
