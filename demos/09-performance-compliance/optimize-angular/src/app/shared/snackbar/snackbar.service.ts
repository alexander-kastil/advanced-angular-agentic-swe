import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class SnackbarService {
  snackbar = inject(MatSnackBar);

  displayAlert(title: string, msg: string) {
    this.snackbar.open(title, msg, {
      duration: 1000
    });
  }
}
