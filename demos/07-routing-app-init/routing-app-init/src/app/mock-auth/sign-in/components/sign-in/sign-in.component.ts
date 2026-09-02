import { AfterViewInit, Component, TemplateRef, inject, viewChild } from '@angular/core';
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../../auth.facade';
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
    ]
})
export class SignInComponent implements AfterViewInit {
  router = inject(Router);
  dialog = inject(MatDialog);
  as = inject(AuthFacade);
  template = viewChild<TemplateRef<unknown>>('dialog');

  ngAfterViewInit() {
    const template = this.template();
    if (template) {
      const ref = this.dialog.open(template, {
        width: '350px'
      });

      ref.afterClosed().subscribe(() => {
        this.router.navigate(['demos']);
      });
    }
  }

  signIn() {
    this.as.setFakeUserAndToken('mockUser');
    this.dialog.closeAll();
  }
}
