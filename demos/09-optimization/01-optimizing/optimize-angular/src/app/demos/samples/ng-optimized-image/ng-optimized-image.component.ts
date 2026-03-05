import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-ng-optimized-image',
    templateUrl: './ng-optimized-image.component.html',
    styleUrls: ['./ng-optimized-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MarkdownRendererComponent]
})
export class NgOptimizedImageComponent {

}
