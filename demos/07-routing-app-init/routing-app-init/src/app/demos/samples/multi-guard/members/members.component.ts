import { Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.scss'],
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent]
})
export class MembersComponent {

}
