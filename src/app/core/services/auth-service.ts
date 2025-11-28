import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { ApiService } from './api-service'; // Custom ApiService for HTTP calls, so we don't need HttpClient or environment
import { AuthResponse, LoginReq, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private apiService = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // --- STATE SIGNALS ---
  // The single source of truth for the current user.
  // null = not logged in.
  private currentUserSignal = signal<User | null>(null);

  // Read-only signals for components to use
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    // On app startup, try to load the user if a token exists
    this.loadCurrentUserFromStorage();
  }

  // --- API METHODS ---

  login(credentials: LoginReq): Observable<boolean> {
    // Uses ApiService.post ('account/login' is appended to base URL)
    // The jwtInterceptor and errorInterceptor run automatically here!
    return this.apiService.post<AuthResponse>('api/account/login', credentials).pipe(
      tap((response) => {
        this.setSession(response);
        this.snackBar.open(`Welcome back, ${response.user.displayName}!`, 'Close', { duration: 3000 });
      }),
      map(() => true),
      catchError(err => {
        // ErrorInterceptor catches the specific HTTP error (401, etc)
        // We just return false here to update UI state (e.g., stop loading spinner)
        return of(false);
      })
    );
  }

  register(formData: FormData): Observable<boolean> {
    return this.apiService.post<AuthResponse>('api/account/register', formData).pipe(
      tap((response) => {
        this.setSession(response);
        this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
      }),
      map(() => true)
    );
  }

  logout(): void {
    // 1. Remove token
    localStorage.removeItem('token');

    // 2. Clear state
    this.currentUserSignal.set(null);

    // 3. Navigate away
    this.router.navigate(['/auth/login']);
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  }

  getProfile(): Observable<User | null> {
    // Uses ApiService.get
    return this.apiService.get<User>('api/account/me').pipe(
      tap(user => this.currentUserSignal.set(user)),
      catchError(() => {
        // If 'me' fails (e.g. token expired), log out
        this.logout();
        return of(null);
      })
    );
  }

  updateProfile(formData: FormData): Observable<User | null> {
    return this.apiService.put<User>('api/account/profile', formData).pipe(
      tap(updatedUser => {
        this.currentUserSignal.set(updatedUser);
        this.snackBar.open('Profile updated!', 'Close', { duration: 3000 });
      })
    );
  }

  // --- INTERNAL HELPER METHODS ---

  private setSession(authResponse: AuthResponse) {
    // 1. Save JWT to LocalStorage (for the Interceptor to pick up)
    localStorage.setItem('token', authResponse.token);

    // 2. Update Signal State
    this.currentUserSignal.set(authResponse.user);
  }

  private loadCurrentUserFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      // Optimistic approach: We have a token, let's assume we are logged in
      // and fetch the fresh profile in the background.
      // Ideally, decode the token payload here to set immediate state if needed.
      this.getProfile().subscribe();
    }
  }

}
