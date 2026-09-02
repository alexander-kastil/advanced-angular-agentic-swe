import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu/menu.service';
import { NavbarService } from './navbar.service';
import { NavItem } from './nav-item.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public ns: NavbarService, public ms: MenuService) { }

  navItems: NavItem[] = [];

  ngOnInit() {
    this.ns.getItems().subscribe((data) => {
      this.navItems = data;
    });
  }

  toggleMenu() {
    this.ms.toggleMenuVisibility();
  }
}

