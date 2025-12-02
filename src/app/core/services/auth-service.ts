import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { ApiService } from './api-service'; // Custom ApiService for HTTP calls, so we don't need HttpClient or environment
import { AuthResponse, LoginReq, User } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { HttpParams } from '@angular/common/http';

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

  // --- NEW METHOD FOR EXTERNAL LOGIN ---
  // Called by the Callback Component to finalize the login
  setExternalSession(token: string, user: User) {
    this.setSession({ token, user, tokenExpiration: '' }); // Expiration handling optional here
    this.snackBar.open(`Welcome back, ${user.displayName}!`, 'Close', { duration: 3000 });
  }

  register(formData: FormData): Observable<boolean> {
    return this.apiService.post<AuthResponse>('api/account/register', formData).pipe(
      tap((response) => {
        //this.setSession(response);
        this.snackBar.open('Registration successful! Please check your email to confirm your account.', 'Close', { duration: 3000 });
      }),
      map(() => true)
    );
  }

  confirmEmail(userId: string, code: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('code', code);

    // This calls GET /api/account/confirm-email?userId=...&code=...
    return this.apiService.get('api/account/confirm-email', params);
  }

  logout(): void {
    // 1. Remove token
    localStorage.removeItem('token');

    // 2. Clear state
    this.currentUserSignal.set(null);

    // 3. Navigate away
    this.router.navigate(['/account/login']);
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  }

  getProfile(): Observable<User | null> {
    // Uses ApiService.get
    return this.apiService.get<User>('api/account/me').pipe(
      tap(user => {
        // Process image before setting signal
        const processedUser = this.processUserImage(user);
        this.currentUserSignal.set(processedUser);
      }),
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
        // Process image before setting signal
        const processedUser = this.processUserImage(updatedUser);
        this.currentUserSignal.set(processedUser);
        this.snackBar.open('Profile updated!', 'Close', { duration: 3000 });
      })
    );
  }

  // --- INTERNAL HELPER METHODS ---

  private setSession(authResponse: AuthResponse) {
    // 1. Process image before setting signal
    const processedUser = this.processUserImage(authResponse.user);

    // 2. Save JWT to LocalStorage (for the Interceptor to pick up)
    localStorage.setItem('token', authResponse.token);

    // 3. Update Signal State
    this.currentUserSignal.set(processedUser);
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

  private processUserImage(user: User): User {
    if (user.profileImageUrl) {
      // Check if it's already a full URL (e.g. Google Image) or a local filename
      if (!user.profileImageUrl.startsWith('http')) {
        // Construct the full backend URL
        const baseUrl = environment.apiURL.replace('/api', '').replace(/\/$/, '');
        user.profileImageUrl = `${baseUrl}/Files/Images/UserImages/${user.profileImageUrl}`;
      }
    } else {
      // Fallback if null (optional, or handle in UI)
      // user.profileImageUrl = 'assets/default-user.png';
      user.profileImageUrl = `${environment.apiURL}/Files/Images/UserImages/default-profile.png`;
    }
    return user;
  }

}
