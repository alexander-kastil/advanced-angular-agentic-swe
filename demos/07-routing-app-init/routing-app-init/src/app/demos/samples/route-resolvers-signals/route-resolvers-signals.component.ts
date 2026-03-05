import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { JsonPipe } from '@angular/common';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ResolvedData } from './route-resolver';

@Component({
    selector: 'app-route-resolvers-signals',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MarkdownRendererComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        JsonPipe,
    ],
    template: `
    <app-markdown-renderer [md]="'route-resolvers-signals'" />
    
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Resolved Data via Signal Input</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (data(); as resolvedData) {
          <div>
            <h3>{{ resolvedData.title }}</h3>
            <pre>{{ resolvedData | json }}</pre>
          </div>
        } @else {
          <p>No data resolved</p>
        }
      </mat-card-content>
    </mat-card>
  `
})
export class RouteResolversSignalsComponent {
    readonly data = input<ResolvedData>();
}
