import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-esbuild',
    templateUrl: './esbuild.component.html',
    styleUrls: ['./esbuild.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MarkdownRendererComponent]
})
export class EsbuildComponent {

}
