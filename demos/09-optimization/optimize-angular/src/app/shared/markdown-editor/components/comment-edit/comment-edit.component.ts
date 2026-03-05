import { Component, Input } from '@angular/core';
import { CommentItem } from '../../comment.model';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ColumnDirective } from '../../../formatting/formatting-directives';

@Component({
    selector: 'app-comment-edit',
    templateUrl: './comment-edit.component.html',
    styleUrls: ['./comment-edit.component.scss'],
    imports: [
        ColumnDirective,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
    ]
})
export class CommentEditComponent {
  @Input() comment: CommentItem = new CommentItem();
}
