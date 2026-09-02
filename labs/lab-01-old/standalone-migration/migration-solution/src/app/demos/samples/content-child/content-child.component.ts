import { Component } from '@angular/core';
import { ProjectorComponent } from './projector/projector.component';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-content-child',
    templateUrl: './content-child.component.html',
    styleUrls: ['./content-child.component.scss'],
    standalone: true,
    imports: [MarkdownRendererComponent, ProjectorComponent],
})
export class ContentChildComponent {
}
