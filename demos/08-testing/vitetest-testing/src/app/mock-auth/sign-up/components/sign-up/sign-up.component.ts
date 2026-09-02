import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [],
})
export class SignUpComponent implements AfterViewInit {
  router = inject(Router);
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  ngAfterViewInit() {
    this.dialog()?.nativeElement.showModal();
  }

  onClosed() {
    this.router.navigate(['demos']);
  }
}
