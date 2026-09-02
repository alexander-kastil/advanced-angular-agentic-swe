import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthFacade } from '../../../mock-auth/auth.facade';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-can-match-guard',
  templateUrl: './can-match-guard.component.html',
  styleUrls: ['./can-match-guard.component.scss'],
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardActions,
    MatButton,
    RouterLink,
    RouterOutlet,
  ],
})
export class CanMatchGuardComponent {
  private auth = inject(AuthFacade);

  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly isPrimeMember = this.auth.isPrimeMember;

  toggleLoggedIn() {
    this.auth.toggleLoggedIn();
  }

  togglePrimeMember() {
    this.auth.togglePrimeMember();
  }
}
