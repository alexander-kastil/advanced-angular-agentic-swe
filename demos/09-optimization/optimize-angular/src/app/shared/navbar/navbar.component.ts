import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SnackbarService } from '../snackbar/snackbar.service';
import { NavbarService } from './navbar.service';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { SideNavService } from '../sidenav/sidenav.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    RouterLinkActive,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  nav = inject(SideNavService);
  ms = inject(NavbarService);
  sns = inject(SnackbarService);
  menuItems = toSignal(this.ms.getTopItems(), { initialValue: [] });

  toggleMenu() {
    this.nav.toggleMenuVisibility();
  }

  toggleApps() {
    this.sns.displayAlert('Apps', 'Not implemented - just a mock');
  }
}
