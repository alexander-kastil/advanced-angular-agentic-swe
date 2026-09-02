import { Component, ElementRef, viewChild } from '@angular/core';
import { SplitPopupComponent } from './split-popup/split-popup.component';
import { uxButtonComponent } from '../../../shared/ux-lib/ux-button/ux-button.component';
import { uxSplitComponent } from '../../../shared/ux-lib/ux-split/ux-split.component';

@Component({
  selector: 'app-content-projection',
  templateUrl: './content-projection.component.html',
  styleUrls: ['./content-projection.component.scss'],
  imports: [uxSplitComponent, uxButtonComponent, SplitPopupComponent],
})
export class ContentProjectionComponent {
  private readonly popup = viewChild.required<ElementRef<HTMLDialogElement>>('popup');

  isDisabled = true;

  openPopup(): void {
    this.popup().nativeElement.showModal();
  }

  closePopup(): void {
    this.popup().nativeElement.close();
  }
}
