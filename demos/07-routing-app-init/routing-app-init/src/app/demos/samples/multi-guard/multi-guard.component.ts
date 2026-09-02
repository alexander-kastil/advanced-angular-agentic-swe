import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthFacade } from '../../../mock-auth/auth.facade';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-multi-guard',
  templateUrl: './multi-guard.component.html',
  styleUrls: ['./multi-guard.component.scss'],
  imports: [MarkdownRendererComponent, RouterLink, RouterOutlet, JsonPipe],
})
export class MultiGuardComponent {
  private auth = inject(AuthFacade);

  readonly title = 'Using multiple Auth Guards';
  readonly user = computed(() => this.auth.user() ?? 'Anonymous');
  readonly isPrimeMember = this.auth.isPrimeMember;
  readonly btnTogglePrimeDisabled = computed(() => !this.auth.isAuthenticated());

  toggleLoggedIn() {
    this.auth.toggleLoggedIn();
  }

  togglePrimeMember() {
    this.auth.togglePrimeMember();
  }
}
