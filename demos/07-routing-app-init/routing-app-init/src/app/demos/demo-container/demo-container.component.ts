import { Component, computed, inject, signal } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MarkdownEditorContainerComponent } from '../../shared/markdown-editor/components/markdown-editor-container/markdown-editor-container.component';
import { SidebarActions } from '../../shared/side-panel/sidebar.actions';
import { SidePanelComponent } from '../../shared/side-panel/side-panel.component';
import { SidePanelService } from '../../shared/side-panel/sidepanel.service';
import { SideNavService } from '../../shared/sidenav/sidenav.service';
import { DemoItem } from './demo-item.model';
import { DemoService } from './demo.service';

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
    SidePanelComponent,
  ],
})
export class DemoContainerComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private nav = inject(SideNavService);
  private panel = inject(SidePanelService);
  private demoService = inject(DemoService);

  readonly title = environment.title;

  readonly demos = this.demoService.demos;
  readonly isLoadingDemos = this.demoService.isLoading;
  readonly hasErrorDemos = this.demoService.hasError;

  readonly hoveredItem = signal<DemoItem | null>(null);
  readonly popupTop = signal(0);
  readonly header = signal('Please select a demo');

  readonly sidenavMode = this.nav.position;
  readonly sidenavVisible = this.nav.visible;

  readonly showMdEditor = computed(
    () => this.panel.getCommands()() === SidebarActions.SHOW_MARKDOWN
  );

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const leaf = this.getLeafRoute(this.route);
        if (leaf.outlet === 'primary' && leaf.component != null) {
          this.header.set(`Component: ${(leaf.component as { name: string }).name.replace(/^_/, '')}`);
        }
      });
  }

  showPopup(item: DemoItem, event: MouseEvent) {
    this.hoveredItem.set(item);
    this.popupTop.set((event.target as HTMLElement).getBoundingClientRect().top);
  }

  hidePopup() {
    this.hoveredItem.set(null);
  }

  private getLeafRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
