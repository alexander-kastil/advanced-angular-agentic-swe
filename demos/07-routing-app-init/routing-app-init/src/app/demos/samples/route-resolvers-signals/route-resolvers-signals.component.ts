import { JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { Album } from './route-resolver';

@Component({
  selector: 'app-route-resolvers-signals',
  templateUrl: './route-resolvers-signals.component.html',
  styleUrls: ['./route-resolvers-signals.component.scss'],
  imports: [MarkdownRendererComponent, RouterLink, JsonPipe],
})
export class RouteResolversSignalsComponent {
  readonly id = input.required({ transform: (value: string | number) => Number(value) });
  readonly album = input.required<Album>();

  readonly previousId = computed(() => Math.max(1, this.id() - 1));
  readonly nextId = computed(() => this.id() + 1);
}
