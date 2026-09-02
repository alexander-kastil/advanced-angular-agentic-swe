import { Component, inject } from '@angular/core';
import { SnackbarService } from '../snackbar/snackbar.service';
import { SideNavService } from '../sidenav/sidenav.service';
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
  ]
})
export class NavbarComponent {
  ms = inject(SideNavService);
  sns = inject(SnackbarService);
  menuItems = this.ms.getTopItems();

  toggleMenu() {
    this.ms.toggleMenuVisibility();
  }

  toggleApps() {
    this.sns.displayAlert('Apps', 'Not implemented - just a mock');
  }
}
