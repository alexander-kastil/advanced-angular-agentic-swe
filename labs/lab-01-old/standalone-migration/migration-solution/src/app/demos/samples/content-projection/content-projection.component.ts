import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SplitPopupComponent } from './split-popup/split-popup.component';
import { uxButtonComponent } from '../../../shared/ux-lib/ux-button/ux-button.component';
import { uxSplitComponent } from '../../../shared/ux-lib/ux-split/ux-split.component';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-content-projection',
    templateUrl: './content-projection.component.html',
    styleUrls: ['./content-projection.component.scss'],
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatButton,
        uxSplitComponent,
        uxButtonComponent,
    ],
})
export class ContentProjectionComponent {
  dialog: MatDialog = inject(MatDialog);
  isDisabled = true;

  openPopup(): void {
    const dialogRef = this.dialog.open(SplitPopupComponent, {
      width: '90vw',
      data: { main: 'this is main', toolbar: 'toolbar' },
    });
  }
}
