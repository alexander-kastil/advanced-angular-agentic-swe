import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BorderDirective, BoxedDirective } from '../../../shared/formatting/formatting-directives';

@Component({
    selector: 'app-directive-composition',
    templateUrl: './directive-composition.component.html',
    styleUrls: ['./directive-composition.component.scss'],
    imports: [
        BorderDirective,
        BoxedDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectiveCompositionComponent {

}
