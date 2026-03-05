import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MarkdownItem } from '../../markdown.model';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ColumnDirective } from '../../../formatting/formatting-directives';

@Component({
    selector: 'app-markdown-edit',
    templateUrl: './markdown-edit.component.html',
    styleUrls: ['./markdown-edit.component.scss'],
    imports: [
        ColumnDirective,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownEditComponent {
    readonly comment = input(new MarkdownItem());
}
