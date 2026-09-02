import { AfterViewInit, Component, TemplateRef, inject, viewChild } from '@angular/core';
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { authStore } from '../../../auth.store';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    RouterLink
  ],
})
export class SignInComponent implements AfterViewInit {
  router = inject(Router);
  dialog = inject(MatDialog);
  store = inject(authStore);
  template = viewChild<TemplateRef<any>>('dialog');

  ngAfterViewInit() {
    const tpl = this.template();
    if (tpl) {
      const ref = this.dialog.open(tpl, {
        width: '350px',
      });

      ref.afterClosed().subscribe(() => {
        this.router.navigate(['demos']);
      });
    }
  }

  signIn() {
    this.store.signIn('mockUser', 'mockPassword');
    this.dialog.closeAll();
  }
}
