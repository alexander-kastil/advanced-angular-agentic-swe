import { ChangeDetectionStrategy, Component } from '@angular/core';
import { uxButtonComponent } from '../../../../shared/ux-lib/ux-button/ux-button.component';
import { uxSplitComponent } from '../../../../shared/ux-lib/ux-split/ux-split.component';

@Component({
  selector: 'app-split-popup',
  templateUrl: './split-popup.component.html',
  styleUrls: ['./split-popup.component.scss'],
  imports: [uxSplitComponent, uxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitPopupComponent {
  isDisabled = true;
}
