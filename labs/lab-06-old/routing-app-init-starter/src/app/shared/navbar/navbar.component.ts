import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { SideNavFacade } from 'src/app/state/sidenav.facade';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterLink, NgFor, AsyncPipe],
})
export class NavbarComponent {
  ns = inject(NavbarService);
  nav = inject(SideNavFacade);
  items = this.ns.getTopItems();

  toggleMenu() {
    this.nav.toggleMenuVisibility();
  }
}