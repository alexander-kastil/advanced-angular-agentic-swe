import { JsonPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-route-inputs',
  templateUrl: './route-inputs.component.html',
  styleUrls: ['./route-inputs.component.scss'],
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    JsonPipe,
  ],
})
export class RouteInputsComponent {
  private router = inject(Router);

  readonly tenant = input.required<string>();
  readonly release = input('');
  readonly highlight = input('', { transform: (value: string | undefined) => value ?? '' });
  readonly draftTitle = input<string | undefined>('set in the component');

  readonly tenants = ['acme', 'globex', 'initech'];
  readonly sections = ['reports', 'billing'];

  readonly bound = computed(() => ({
    tenant: this.tenant(),
    release: this.release(),
    highlight: this.highlight() || '(no highlight query param)',
    draftTitle: this.draftTitle() ?? '(router wrote undefined over the default)',
  }));

  switchTenant(tenant: string) {
    this.router.navigate(['/demos/route-inputs', tenant, 'reports'], {
      queryParamsHandling: 'preserve',
    });
  }

  setHighlight(value: string) {
    this.router.navigate([], {
      queryParams: { highlight: value || undefined },
      queryParamsHandling: 'merge',
    });
  }
}
