import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);

  show(message: string, type: 'success'|'error'|'info'|'warn' = 'info', duration = 3000) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: [`toast-${type}`]
    });
  }
  success(m: string,d=3000){this.show(m,'success',d)}
  error(m: string,d=5000){this.show(m,'error',d)}
  info(m: string,d=3000){this.show(m,'info',d)}
  warn(m: string,d=4000){this.show(m,'warn',d)}
}
