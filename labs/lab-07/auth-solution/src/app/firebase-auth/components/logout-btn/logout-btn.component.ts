import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../firebase-auth.service';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-logout-btn',
    templateUrl: './logout-btn.component.html',
    styleUrls: ['./logout-btn.component.scss'],
    standalone: true,
    imports: [MatButton, AsyncPipe],
})
export class LogoutBtnComponent implements OnInit {
  currentUser = this.as.getUser();
  constructor(private as: FirebaseAuthService) {}

  ngOnInit(): void {}

  logOut() {
    this.as.logOut();
  }
}
