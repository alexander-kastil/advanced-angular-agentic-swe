import { Component, ChangeDetectionStrategy } from '@angular/core';
import { User } from './user-model';
import { usersdata } from './users-data';
import { DatePipe } from '@angular/common';
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-material-async',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './material-async.component.html',
    styleUrls: ['./material-async.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatTabGroup,
        MatTab,
        MatTabLabel,
        DatePipe,
    ]
})
export class MaterialAsyncComponent {
    displayedColumns = ['email', 'created', 'roles'];
    users: User[] = usersdata;
}
