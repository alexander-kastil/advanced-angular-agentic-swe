import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { authStore } from '../../../auth.store';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [RouterLink],
})
export class SignInComponent implements AfterViewInit {
  router = inject(Router);
  store = inject(authStore);
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  ngAfterViewInit() {
    this.dialog()?.nativeElement.showModal();
  }

  onClosed() {
    this.router.navigate(['demos']);
  }

  signIn() {
    this.store.signIn('mockUser', 'mockPassword');
    this.dialog()?.nativeElement.close();
  }
}
