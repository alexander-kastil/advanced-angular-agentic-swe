import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { LayoutStore } from '../layout/layout.store';
import { SideNavService } from '../sidenav/sidenav.service';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { mdEditorEvents } from '../markdown-editor/markdown-editor.events';
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatMiniFabButton,
    MatIcon,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidePanelComponent {
  protected layout = inject(LayoutStore);
  private sidenav = inject(SideNavService);
  private dispatch = injectDispatch(mdEditorEvents);

  private router = inject(Router);
  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  isDemosRoute = computed(() => this.url().startsWith('/demos'));

  isEditorActive = this.layout.isEditorActive;

  toggleSideNav() {
    this.sidenav.toggleMenuVisibility();
  }

  showGuide() {
    this.layout.showGuide();
  }

  toggleEditor() {
    this.layout.toggleEditor();
  }

  addMarkdownItem() {
    this.dispatch.addItem();
  }
}
