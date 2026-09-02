import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../../mock-auth/auth.facade';
import { SideNavService } from '../sidenav/sidenav.service';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [MatToolbar, MatToolbarRow, MatIcon, RouterLinkActive, RouterLink],
})
export class NavbarComponent {
  private nav = inject(SideNavService);
  private ms = inject(NavbarService);
  private auth = inject(AuthFacade);

  readonly menuItems = this.ms.topItems.value;
  readonly isAuthenticated = this.auth.isAuthenticated;

  toggleMenu() {
    this.nav.toggleMenuVisibility();
  }

  logIn() {
    this.auth.toggleLoggedIn();
  }
}
