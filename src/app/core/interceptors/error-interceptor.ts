import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar); // Inject Material SnackBar
  const router = inject(Router);

  const ERROR_MESSAGES = { // Centralized error messages for consistency, can be expanded as needed
    400: 'Bad request',
    401: 'Unauthorized access',
    404: 'Resource not found',
    500: 'Server error - Please try again later'
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        // 1. Extract the message from the backend response (if it exists)
        // Your API returns: { message: "Invalid password" }
        // In Angular, this is found in: error.error.message
        const serverMessage = error.error?.message;

        if (error.status === 400) {
          if (error.error.errors) {
            // This handles Validation Errors (e.g. ModelState dictionary)
            // format: { errors: { Email: ["Required"] } }
            const modelStateErrors = [];
            for (const key in error.error.errors) {
              if (error.error.errors[key]) {
                modelStateErrors.push(error.error.errors[key]);
              }
            }
            // Show the first validation error found
            snackBar.open(modelStateErrors.flat()[0] || 'Validation Error', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            throw error.error; // Rethrow for component-level handling if needed
          } else {
            // This handles logic BadRequests (e.g. "Email already taken")
            snackBar.open(serverMessage || error.message, 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'] // You can define this class in global styles.scss
            });
          }
        }

        if (error.status === 401) {
          // --- THIS IS THE FIX FOR LOGIN ---
          // Use serverMessage if available, otherwise fallback to 'Unauthorized'
          snackBar.open(serverMessage || 'Unauthorized access', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          // Optional: Clear token and redirect to login
          // localStorage.removeItem('token');
          // router.navigateByUrl('/auth/login');
        }

        if (error.status === 404) {
          snackBar.open(serverMessage || 'Resource not found', 'Close', {
            duration: 4000,
            panelClass: ['warning-snackbar']
          });
          router.navigateByUrl('/not-found');
        }

        if (error.status === 500) {
          snackBar.open(serverMessage || 'Server Error - Please try again later', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      }

      return throwError(() => error);

    })
  );

};