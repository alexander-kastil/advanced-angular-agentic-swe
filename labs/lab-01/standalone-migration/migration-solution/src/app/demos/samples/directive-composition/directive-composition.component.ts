import { Component } from '@angular/core';
import { FontBoldDirective, HeightDirective, WidthDirective, BorderDirective, BoxedDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-directive-composition',
    templateUrl: './directive-composition.component.html',
    styleUrls: ['./directive-composition.component.scss'],
    standalone: true,
    imports: [MarkdownRendererComponent, FontBoldDirective, HeightDirective, WidthDirective, BorderDirective, BoxedDirective]
})
export class DirectiveCompositionComponent {

}
