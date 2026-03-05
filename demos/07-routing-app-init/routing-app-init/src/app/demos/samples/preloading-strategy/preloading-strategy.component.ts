import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Injectable } from '@angular/core';

/**
 * Custom preloading strategy that only preloads routes with data: { preload: true }
 */
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      this.preloadedModules.push(route.path || '');
      console.log('Preloading:', route.path);
      return load();
    } else {
      return of(null);
    }
  }
}

@Component({
  selector: 'app-preloading-strategy',
  templateUrl: './preloading-strategy.component.html',
  styleUrls: ['./preloading-strategy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatButton
  ]
})
export class PreloadingStrategyComponent {
  private router = inject(Router);
  protected strategy = inject(SelectivePreloadingStrategy);

  protected navigateToCustomers() {
    this.router.navigate(['/customers']);
  }

  protected navigateToSkills() {
    this.router.navigate(['/skills']);
  }
}
