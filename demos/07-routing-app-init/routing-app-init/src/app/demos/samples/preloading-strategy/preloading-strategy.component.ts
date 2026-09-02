import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { SelectivePreloadingStrategy } from './selective-preloading.strategy';

@Component({
  selector: 'app-preloading-strategy',
  templateUrl: './preloading-strategy.component.html',
  styleUrls: ['./preloading-strategy.component.scss'],
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButton,
  ],
})
export class PreloadingStrategyComponent {
  private router = inject(Router);
  private strategy = inject(SelectivePreloadingStrategy);

  readonly preloadedRoutes = this.strategy.preloadedRoutes;

  navigateToCustomers() {
    this.router.navigate(['/customers']);
  }

  navigateToSkills() {
    this.router.navigate(['/skills']);
  }
}
