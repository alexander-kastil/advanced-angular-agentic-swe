import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { RouterLink, RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthFacade } from '../../../mock-auth/state/auth.facade';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-multi-guard',
  templateUrl: './multi-guard.component.html',
  styleUrls: ['./multi-guard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    RouterLink,
    RouterOutlet,
    JsonPipe,
  ]
})
export class MultiGuardComponent {
  title = 'Using multiple Auth Guards';
  auth = inject(AuthFacade);
  user = toSignal(this.auth.getUser());

  btnTogglePrimeEnabled = toSignal(this.auth.isAuthenticated()
    .pipe(map((LoggedIn) => !LoggedIn)));

  toggleLoggedIn() {
    this.auth.toggleLoggedIn()
  }

  togglePrimeMember() {
    this.auth.togglePrimeMember()
  }
}
