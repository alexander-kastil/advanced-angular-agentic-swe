import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { Router, RouterOutlet } from '@angular/router';
import { ErrorLogService } from '../../../error/error-log.service';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-navigation-errors',
  templateUrl: './navigation-errors.component.html',
  styleUrls: ['./navigation-errors.component.scss'],
  imports: [
    MarkdownRendererComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    RouterOutlet,
  ],
})
export class NavigationErrorsComponent {
  private router = inject(Router);
  private log = inject(ErrorLogService);

  readonly entries = this.log.entries;

  breakNavigation() {
    this.router.navigate(['/demos/navigation-errors/broken']);
  }

  throwUnhandled() {
    throw new Error('Nothing caught this, so the ErrorHandler token owns it');
  }
}
