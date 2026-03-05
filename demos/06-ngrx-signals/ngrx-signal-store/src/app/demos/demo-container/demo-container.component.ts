import { ChangeDetectionStrategy, Component, computed, inject, signal, resource, effect, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { filter, lastValueFrom } from 'rxjs';
import { LayoutStore } from '../../shared/layout/layout.store';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../shared/loading/loading.service';
import { SideNavService } from '../../shared/sidenav/sidenav.service';
import { markdownEditorStore } from '../../shared/markdown-editor/markdown-editor.store';
import { DemoItem } from './demo-item.model';
import { SidePanelComponent } from '../../shared/side-panel/side-panel.component';
import { MarkdownEditorContainerComponent } from '../../shared/markdown-editor/components/markdown-editor-container/markdown-editor-container.component';
import { MarkdownRendererComponent } from '../../shared/markdown-renderer/markdown-renderer.component';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { SplitComponent, SplitAreaComponent } from 'angular-split';

@Component({
  selector: 'app-demo-container',
  templateUrl: './demo-container.component.html',
  styleUrls: ['./demo-container.component.scss'],
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatToolbar,
    MatToolbarRow,
    MatNavList,
    MatListItem,
    RouterLink,
    MatSidenavContent,
    RouterOutlet,
    MarkdownEditorContainerComponent,
    MarkdownRendererComponent,
    SidePanelComponent,
    SplitComponent,
    SplitAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoContainerComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  nav = inject(SideNavService);
  ls = inject(LoadingService);
  layout = inject(LayoutStore);
  markdownStore = inject(markdownEditorStore);

  hoveredItem = signal<DemoItem | null>(null);
  popupTop = signal(0);

  title: string = environment.title;

  demosResource = resource({
    loader: () => lastValueFrom(this.http.get<DemoItem[]>(`${environment.api}demos`))
  });

  demos = computed(() => {
    const items = this.demosResource.value() ?? [];
    return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  });
  isLoadingDemos = computed(() => this.demosResource.status() === 'loading');
  hasErrorDemos = computed(() => this.demosResource.status() === 'error');

  sidenavMode = this.nav.getSideNavPosition();
  sidenavVisible = this.nav.getSideNavVisible();
  isLoading = this.ls.getLoading();

  header = signal('Please select a demo');
  currentUrl = signal('');

  currentMd = computed(() => {
    const url = this.currentUrl();
    if (!url) return '';
    const demo = this.demos().find(d => d.url === url);
    return demo?.md ?? '';
  });

  currentDemoTitle = computed(() => {
    const url = this.currentUrl();
    if (!url) return '';
    const demo = this.demos().find(d => d.url === url);
    return demo?.title ?? '';
  });

  guideMd = computed(() => {
    const url = `demos/${this.currentUrl()}`;
    const override = this.markdownStore.getPageOverride()(url);
    return override?.comment ?? this.currentMd();
  });

  markdownPaneVisible = this.layout.markdownPaneVisible;
  markdownMode = this.layout.markdownMode;
  showMarkdownPane = this.layout.showMarkdownPane;
  demoPaneSize = this.layout.demoPaneSize;

  hasDemoContent = signal(true);

  @ViewChild('demoPaneContent') demoPaneContent!: ElementRef<HTMLElement>;

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe((event) => {
      this.layout.resetToGuide();
      const rootRoute = this.getRootRoute(this.route);
      if (rootRoute.outlet === 'primary' && rootRoute.component != null) {
        const name = rootRoute.component.name.replace(/^_/, '');
        this.header.set(`Component: ${name}`);
      }
      const url = event.urlAfterRedirects.split('/').pop() ?? '';
      this.currentUrl.set(url);

      setTimeout(() => {
        const el = this.demoPaneContent?.nativeElement;
        if (el && el.children.length > 1) {
          const componentEl = el.children[1] as HTMLElement;
          this.hasDemoContent.set(componentEl.offsetHeight > 10);
        } else {
          this.hasDemoContent.set(false);
        }
      }, 50);
    });

    effect(() => {
      this.layout.setHasMarkdownContent(!!this.currentMd());
    });
  }

  onSplitDragEnd(event: { sizes: (number | '*')[] }): void {
    const demoSize = event.sizes[0];
    if (typeof demoSize === 'number' && this.hasDemoContent()) {
      this.layout.setDemoPaneSize(demoSize);
    }
  }

  showPopup(item: DemoItem, event: MouseEvent): void {
    this.hoveredItem.set(item);
    this.popupTop.set((event.target as HTMLElement).getBoundingClientRect().top);
  }

  hidePopup(): void {
    this.hoveredItem.set(null);
  }

  private getRootRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
