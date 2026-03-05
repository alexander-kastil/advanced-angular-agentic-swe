
import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownRendererModule } from '../../../shared/markdown-renderer/markdown-renderer.module';

@Component({
  selector: 'app-standalone',
  standalone: true,
  imports: [MarkdownModule, MarkdownRendererModule],
  templateUrl: './standalone.component.html',
  styleUrls: ['./standalone.component.scss'],
})
export class StandaloneComponent { }

