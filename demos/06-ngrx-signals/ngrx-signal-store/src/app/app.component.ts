import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment.development';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NavbarComponent, RouterOutlet, SnackbarComponent],
})
export class AppComponent {
  readonly titleService = inject(Title);
  readonly title = signal(environment.title);

  constructor() {
    this.titleService.setTitle(this.title());
  }
}
