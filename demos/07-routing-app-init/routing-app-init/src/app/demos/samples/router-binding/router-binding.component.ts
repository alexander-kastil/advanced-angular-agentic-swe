import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-router-binding',
    templateUrl: './router-binding.component.html',
    styleUrls: ['./router-binding.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MarkdownRendererComponent]
})
export class RouterBindingComponent {

}
