import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MarkdownRendererComponent } from '../../shared/markdown-renderer/markdown-renderer.component';
import { DemoService } from './demo.service';

@Component({
  selector: 'app-demo-container',
  templateUrl: './demo-container.component.html',
  styleUrl: './demo-container.component.scss',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MarkdownRendererComponent]
})
export class DemoContainerComponent {
  private readonly router = inject(Router);
  private readonly demoService = inject(DemoService);

  private readonly navigation = toSignal(
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)),
    { initialValue: null }
  );

  readonly topics = this.demoService.topics;
  readonly isLoading = this.demoService.isLoading;
  readonly hasError = this.demoService.hasError;

  readonly currentUrl = computed(() => {
    const url = this.navigation()?.urlAfterRedirects ?? this.router.url;
    const segment = url.split('/').pop() ?? '';
    return segment === 'demos' ? '' : segment;
  });

  readonly current = computed(() => this.demoService.byUrl(this.currentUrl()));

  readonly guideSrc = computed(() => {
    const md = this.current()?.md;
    return md ? `${environment.markdownPath}${md}.md` : '';
  });
}
