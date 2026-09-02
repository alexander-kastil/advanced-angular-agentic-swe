import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [NavbarComponent, RouterOutlet]
})
export class AppComponent implements OnInit {
  private titleService = inject(Title);

  title = environment.title;
  selectedTheme = 'default';

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  toggleTheme() {
    this.selectedTheme = this.selectedTheme === 'default' ? 'dark' : 'default';
  }
}
