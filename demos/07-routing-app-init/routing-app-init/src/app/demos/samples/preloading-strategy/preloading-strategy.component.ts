import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { SelectivePreloadingStrategy } from './selective-preloading.strategy';

@Component({
  selector: 'app-preloading-strategy',
  templateUrl: './preloading-strategy.component.html',
  styleUrls: ['./preloading-strategy.component.scss'],
  imports: [MarkdownRendererComponent],
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
