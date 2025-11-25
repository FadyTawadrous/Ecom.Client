import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar); // Inject Material SnackBar
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        if (error.status === 400) {
          if (error.error.errors) {
            throw error.error; // Validation errors handled by components usually
          } else {
            // Use snackBar.open instead of toastr.error
            snackBar.open(error.error.message, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'] // You can define this class in global styles.scss
            });
          }
        }
        if (error.status === 401) {
          snackBar.open('Unauthorized access', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          // Optional: Clear token and redirect to login
          // localStorage.removeItem('token');
          // router.navigateByUrl('/auth/login');
        }
        if (error.status === 404) {
          snackBar.open('Resource not found', 'Close', {
            duration: 3000,
            panelClass: ['warning-snackbar']
          });
          router.navigateByUrl('/not-found');
        }
        if (error.status === 500) {
          snackBar.open('Server Error - Please try again later', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      }
      return throwError(() => error);
    })
  );
};