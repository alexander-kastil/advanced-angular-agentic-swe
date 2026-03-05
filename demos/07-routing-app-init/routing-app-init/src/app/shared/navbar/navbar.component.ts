import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SideNavService } from '../sidenav/sidenav.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { NavbarService } from './navbar.service';
import { AsyncPipe } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { AuthFacade } from 'src/app/mock-auth/state/auth.facade';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatIcon,
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
  ]
})
export class NavbarComponent {
  nav = inject(SideNavService);
  ms = inject(NavbarService);
  sns = inject(SnackbarService);
  auth = inject(AuthFacade);
  menuItems = this.ms.getTopItems();

  toggleMenu() {
    this.nav.toggleMenuVisibility();
  }

  logIn() {
    this.auth.toggleLoggedIn();
  }
}
