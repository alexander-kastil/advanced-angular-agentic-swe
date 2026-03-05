import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { PhonenumberPipe } from './phonenumber.pipe';

@Component({
    selector: 'app-test-pipe',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './test-pipe.component.html',
    styleUrls: ['./test-pipe.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        PhonenumberPipe,
    ]
})
export class TestPipeComponent {
    phone = "3333333333";
}
