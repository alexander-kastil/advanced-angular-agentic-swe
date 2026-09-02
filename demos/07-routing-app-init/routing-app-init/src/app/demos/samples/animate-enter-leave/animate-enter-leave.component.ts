import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-animate-enter-leave',
  templateUrl: './animate-enter-leave.component.html',
  styleUrls: ['./animate-enter-leave.component.scss'],
  imports: [MarkdownRendererComponent, RouterLink, RouterLinkActive, RouterOutlet],
})
export class AnimateEnterLeaveComponent {}
