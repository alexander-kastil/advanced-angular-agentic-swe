import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../../auth.facade';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [RouterLink]
})
export class SignInComponent implements AfterViewInit {
  router = inject(Router);
  as = inject(AuthFacade);
  dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  ngAfterViewInit() {
    const el = this.dialog().nativeElement;
    if (!el.open) {
      el.showModal();
    }
  }

  signIn() {
    this.as.setFakeUserAndToken('mockUser');
    const el = this.dialog().nativeElement;
    if (el.open) {
      el.close();
    }
  }

  onClosed() {
    this.router.navigate(['demos']);
  }
}
