import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // 1. Check if user is logged in
  const user = authService.currentUser();
  const token = localStorage.getItem('token');

  if (!user && !token) {
    snackBar.open('You must be logged in to access this page', 'Close', { duration: 3000 });
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  // 2. If we have a user signal, check if role is Admin
  // If user signal is null but token exists, allow temporary access (optimistic)
  const isAdmin = user?.roles?.includes('Admin');
  if (isAdmin) {
    return true;
  }

  // 3. Not an admin
  snackBar.open('You are not authorized to access this page', 'Close', { duration: 3000 });
  router.navigate(['/shopping']); // redirect to a safe page
  return false;
};
