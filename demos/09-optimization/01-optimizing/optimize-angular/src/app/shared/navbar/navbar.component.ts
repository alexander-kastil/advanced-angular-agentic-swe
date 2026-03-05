import { Component, inject } from '@angular/core';
import { SideNavService } from '../sidenav/sidenav.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { NavbarService } from './navbar.service';
import { AsyncPipe } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

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
        AsyncPipe,
    ]
})
export class NavbarComponent {
  nav = inject(SideNavService);
  ms = inject(NavbarService);
  sns = inject(SnackbarService);
  menuItems = this.ms.getTopItems();

  toggleMenu() {
    this.nav.toggleMenuVisibility();
  }

  toggleApps() {
    this.sns.displayAlert('Apps', 'Not implemented - just a mock');
  }
}
