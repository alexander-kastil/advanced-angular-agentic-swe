import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MarkdownRendererComponent } from 'src/app/shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-view-transitions',
    imports: [MarkdownRendererComponent],
    templateUrl: './view-transitions.component.html',
    styleUrl: './view-transitions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTransitionsComponent {

}
