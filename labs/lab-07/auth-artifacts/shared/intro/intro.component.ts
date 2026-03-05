import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { combineLatestWith, map } from 'rxjs/operators';
import { ColumnDirective } from '../formatting/formatting-directives';
import { FirebaseAuthService } from '../../firebase-auth/firebase-auth.service';
import { RegisterComponent } from '../../firebase-auth/components/register/register.component';
import { LoginComponent } from '../../firebase-auth/components/login/login.component';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatButtonModule,
    ColumnDirective,
    RegisterComponent,
    LoginComponent
  ]
})
export class IntroComponent {
  dialog = inject(MatDialog);
  as = inject(FirebaseAuthService);
  router = inject(Router);

  @ViewChild('register') registerTemplate!: TemplateRef<any>;
  @ViewChild('login') loginTemplate!: TemplateRef<any>;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() img: string = '';
  authEnabled = this.as.isAuthenticated();

  logIn() {
    this.dialog
      .open(this.loginTemplate, { width: '350px' })
      .afterClosed()
      .pipe(
        combineLatestWith(this.as.isAuthenticated()),
        map(([close, isAuthenticated]) => {
          if (isAuthenticated) {
            this.router.navigate(['demos']);
          } else {
            this.router.navigate(['/']);
          }
        })
      )
      .subscribe();
  }

  registerUser() {
    this.dialog
      .open(this.registerTemplate, { width: '350px' })
      .afterClosed()
      .pipe(
        combineLatestWith(this.as.isAuthenticated()),
        map(([close, isAuthenticated]) => {
          if (isAuthenticated) {
            this.router.navigate(['demos']);
          } else {
            this.router.navigate(['/']);
          }
        })
      )
      .subscribe();
  }

  goToDemos() {
    this.router.navigate(['demos']);
  }
}
