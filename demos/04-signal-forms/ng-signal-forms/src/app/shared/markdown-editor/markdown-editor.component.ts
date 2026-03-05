import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-markdown-editor',
    templateUrl: './markdown-editor.component.html',
    styleUrls: ['./markdown-editor.component.scss'],
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownEditorComponent {
}
