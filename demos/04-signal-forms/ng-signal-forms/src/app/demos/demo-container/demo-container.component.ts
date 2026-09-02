import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { SidebarActions } from 'src/app/shared/side-panel/sidebar.actions';
import { SidePanelService } from 'src/app/shared/side-panel/sidepanel.service';
import { environment } from 'src/environments/environment';
import { SideNavService } from '../../shared/sidenav/sidenav.service';
import { DemoItem } from './demo-item.model';
import { SidePanelComponent } from '../../shared/side-panel/side-panel.component';
import { MarkdownEditorComponent } from '../../shared/markdown-editor/markdown-editor.component';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

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
    MarkdownEditorComponent,
    SidePanelComponent,
  ]
})
export class DemoContainerComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private nav = inject(SideNavService);
  private eb = inject(SidePanelService);

  hoveredItem = signal<DemoItem | null>(null);
  popupTop = signal(0);

  title = environment.title;

  demosResource = httpResource<DemoItem[]>(() => `${environment.api}demos`);

  demos = computed(() =>
    [...(this.demosResource.value() ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  isLoadingDemos = computed(() => this.demosResource.status() === 'loading');
  hasErrorDemos = computed(() => this.demosResource.status() === 'error');

  sidenavMode = this.nav.getSideNavPosition();
  sidenavVisible = this.nav.getSideNavVisible();

  header = signal('Please select a demo');

  showMdEditor = computed(() => this.eb.getCommands()() === SidebarActions.SHOW_MARKDOWN);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rootRoute = this.getRootRoute(this.route);
        if (rootRoute.outlet === 'primary' && rootRoute.component != null) {
          this.header.set(`Component: ${rootRoute.component.name.replace(/^_/, '')}`);
        }
      }
    });
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
