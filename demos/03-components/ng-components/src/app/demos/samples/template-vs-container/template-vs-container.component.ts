import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { ExpanderTemplateComponent } from './expander-template/expander-template.component';
import { ClockComponent } from './clock/clock.component';
import { ExpanderComponent } from './expander-content/expander.component';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-template-vs-container',
    templateUrl: './template-vs-container.component.html',
    styleUrls: ['./template-vs-container.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        ExpanderComponent,
        ClockComponent,
        ExpanderTemplateComponent,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateVsContainerComponent {
    currentTime = interval(100).pipe(map(() => new Date().toTimeString()));
}
