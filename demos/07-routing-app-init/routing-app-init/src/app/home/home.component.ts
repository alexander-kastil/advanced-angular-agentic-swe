import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthFacade } from '../mock-auth/state/auth.facade';
import { IntroComponent } from '../shared/intro/intro.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IntroComponent]
})
export class HomeComponent {
  auth = inject(AuthFacade);
  isAuthenticated = this.auth.isAuthenticated();
}
