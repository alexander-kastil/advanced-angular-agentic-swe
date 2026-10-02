import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../auth/auth.store';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-app-auth-flow',
  templateUrl: './app-auth-flow.component.html',
  styleUrl: './app-auth-flow.component.scss',
  imports: [CodeBlockComponent]
})
export class AppAuthFlowComponent {
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  readonly name = signal('Ada Lovelace');
  readonly sessionExpired = computed(() => this.auth.token() !== null && !this.auth.isAuthenticated());

  readonly loginSnippet = `async login(): Promise<void> {
  this.auth.login(this.name(), 20);
  const returnUrl = this.auth.takeReturnUrl();
  if (returnUrl) {
    await this.router.navigateByUrl(returnUrl);
  }
}`;

  readonly shellSnippet = `@if (auth.isAuthenticated()) {
  <app-navbar />
  <app-current-user [name]="auth.userName()" (logout)="auth.logout()" />
} @else {
  <app-login />
}`;

  setName(value: string): void {
    this.name.set(value);
  }

  async login(): Promise<void> {
    this.auth.login(this.name(), 20);
    const returnUrl = this.auth.takeReturnUrl();
    if (returnUrl) {
      await this.router.navigateByUrl(returnUrl);
    }
  }
}
