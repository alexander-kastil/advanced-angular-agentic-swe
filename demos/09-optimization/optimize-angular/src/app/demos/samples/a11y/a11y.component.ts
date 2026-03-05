import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-a11y',
    templateUrl: './a11y.component.html',
    styleUrls: ['./a11y.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MarkdownRendererComponent]
})
export class A11yComponent {

}
