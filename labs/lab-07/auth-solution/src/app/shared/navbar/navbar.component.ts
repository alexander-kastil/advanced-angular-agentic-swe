import { Component, inject } from '@angular/core';
import { NavbarService } from './navbar.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogoutBtnComponent } from '../../firebase-auth/components/logout-btn/logout-btn.component';
import { CurrentUserComponent } from '../../firebase-auth/components/current-user/current-user.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, RouterLink, MatToolbarModule, LogoutBtnComponent, CurrentUserComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  ns = inject(NavbarService);
  items = this.ns.getTopItems();
}
