import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [NavbarComponent, RouterOutlet]
})
export class AppComponent {
  titleService = inject(Title);
  title: string = environment.title;

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }
}
