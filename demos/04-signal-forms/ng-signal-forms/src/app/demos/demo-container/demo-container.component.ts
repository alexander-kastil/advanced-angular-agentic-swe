import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, resource } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SidebarActions } from 'src/app/shared/side-panel/sidebar.actions';
import { SidePanelService } from 'src/app/shared/side-panel/sidepanel.service';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../../shared/loading/loading.service';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoContainerComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  nav = inject(SideNavService);
  ls = inject(LoadingService);
  eb = inject(SidePanelService);

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

  showMdEditor = computed(() =>
    this.eb.getCommands()() === SidebarActions.SHOW_MARKDOWN
  );

  constructor() {
    effect(() => {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const rootRoute = this.getRootRoute(this.route);
          if (rootRoute.outlet === 'primary' && rootRoute.component != null) {
            const name = rootRoute.component.name.replace(/^_/, '');
            this.header.set(`Component: ${name}`);
          }
        }
      });
    }, { allowSignalWrites: true });
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
