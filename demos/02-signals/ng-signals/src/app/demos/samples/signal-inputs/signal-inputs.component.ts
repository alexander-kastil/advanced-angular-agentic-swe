import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkillsContainerComponent } from "../../../skills/skills-container/skills-container.component";

@Component({
    selector: 'app-signal-inputs',
    imports: [SkillsContainerComponent],
    templateUrl: './signal-inputs.component.html',
    styleUrl: './signal-inputs.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalInputsComponent {

}
