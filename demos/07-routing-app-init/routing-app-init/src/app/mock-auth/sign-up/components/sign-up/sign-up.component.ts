import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements AfterViewInit {
  router = inject(Router);
  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  ngAfterViewInit() {
    const el = this.dialog().nativeElement;
    if (!el.open) {
      el.showModal();
    }
  }

  onClosed() {
    this.router.navigate(['demos']);
  }
}
