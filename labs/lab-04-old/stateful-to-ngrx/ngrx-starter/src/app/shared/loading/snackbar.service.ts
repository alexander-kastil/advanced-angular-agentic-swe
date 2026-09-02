import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  snackBar = inject(MatSnackBar);

  displayAlert(title: string, msg: string) {
    this.snackBar.open(title, msg, {
      duration: 1000,
    });
  }
}
