import { AfterViewInit, Component, TemplateRef, inject, viewChild } from '@angular/core';
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';

@Component({
    selector: 'sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatFormField,
        MatInput,
        MatDialogActions,
        MatButton,
    ]
})
export class SignUpComponent implements AfterViewInit {
  router = inject(Router);
  dialog = inject(MatDialog);
  template = viewChild<TemplateRef<unknown>>('dialog');

  ngAfterViewInit() {
    const template = this.template();
    if (template) {
      const ref = this.dialog.open(template, {
        width: '350px'
      });

      ref.afterClosed().subscribe(() => {
        this.router.navigate(['demos']);
        this.dialog.closeAll();
      });
    }
  }
}
