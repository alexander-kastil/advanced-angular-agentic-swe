import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ConfigService } from '../../../app-init/config.service';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { DemoService } from '../../demo-container/demo.service';

@Component({
  selector: 'app-app-init',
  templateUrl: './app-init.component.html',
  styleUrls: ['./app-init.component.scss'],
  imports: [MarkdownRendererComponent, MatCard, MatCardHeader, MatCardTitle, MatCardContent, JsonPipe],
})
export class AppInitComponent {
  private configService = inject(ConfigService);
  private demoService = inject(DemoService);

  readonly config = this.configService.config;
  readonly demos = this.demoService.demos;
}
