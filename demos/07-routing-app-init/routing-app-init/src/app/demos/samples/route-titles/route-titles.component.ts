import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-route-titles',
  templateUrl: './route-titles.component.html',
  styleUrls: ['./route-titles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle
  ]
})
export class RouteTitlesComponent {
  private router = inject(Router);
  private titleService = inject(Title);

  protected currentTitle = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.titleService.getTitle())
    )
  );
}
