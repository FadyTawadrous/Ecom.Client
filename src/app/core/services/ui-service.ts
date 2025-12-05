import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class UiService {

  private snack = inject(MatSnackBar);

  success(message: string) {
    this.snack.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  error(message: string) {
    this.snack.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }

  warn(message: string) {
    this.snack.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-warn']
    });
  }
}
