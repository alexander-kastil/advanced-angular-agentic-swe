import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavbarComponent, RouterOutlet]
})
export class AppComponent {

  constructor() {
    console.log('AppComponent constructor');
  }

  readonly title = environment.title;
  readonly selectedTheme = signal<'default' | 'dark'>('default');

  toggleTheme() {
    this.selectedTheme.update((theme) => theme === 'default' ? 'dark' : 'default');
    console.log(this.selectedTheme());
  }
}
