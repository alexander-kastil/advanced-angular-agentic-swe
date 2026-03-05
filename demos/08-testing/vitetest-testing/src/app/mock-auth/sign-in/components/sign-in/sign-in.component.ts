import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
  @ViewChild('dialog') template: TemplateRef<any> | null = null;

  ngAfterViewInit() {
    if (this.template) {
      const ref = this.dialog.open(this.template, {
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
