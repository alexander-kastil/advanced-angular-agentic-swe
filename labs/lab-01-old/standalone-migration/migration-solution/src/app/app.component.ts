import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment.development';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [NavbarComponent, RouterOutlet],
})
export class AppComponent {
  titleService = inject(Title);
  title: string = environment.title;

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
