import { Injectable, inject } from '@angular/core';
import { ApiService } from './api-service';
import { AuthService } from './auth-service';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})

export class FaceIdService {

  private api = inject(ApiService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  // 1. Register Face (Logged in user)
  registerFace(imageFile: File): Observable<any> {
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error('User must be logged in to register Face ID');
    }

    const formData = new FormData();
    // Matches RegisterFaceIdVM properties
    formData.append('AppUserId', user.id);
    formData.append('CreatedBy', user.id);
    formData.append('imageFile', imageFile);

    return this.api.post('api/FaceId/register', formData).pipe(
      tap(() => this.snackBar.open('Face ID registered successfully!', 'Close', { duration: 3000 }))
    );
  }

  // 2. Login with Face (Anonymous)
  loginWithFace(imageFile: File): Observable<any> {
    const formData = new FormData();
    // Matches the controller argument: public async Task<IActionResult> Login(IFormFile image)
    formData.append('image', imageFile);

    return this.api.post<{ result: string }>('api/FaceId/login', formData).pipe(
      tap((response) => {
        // The backend returns a Token string in the 'result' property based on your controller logic
        // We need to verify the exact JSON shape. 
        // Based on your controller: return result.IsSuccess ? Ok(result) : ...
        // And result.Result is the token string.
        if (response && response.result) {
          // We need to decode the user from token or fetch profile immediately
          // For now, we manually set the token. 
          localStorage.setItem('token', response.result);
          // Trigger a profile fetch to update the UI/State
          this.authService.getProfile().subscribe();
          this.snackBar.open(`Face Login Successful!. Welcome back, ${this.authService.currentUser()?.displayName}!`, 'Close', { duration: 3000 });
        }
      })
    );
  }

  // 3. Check if Face ID exists (Optional, for UI toggles)
  checkFaceIdStatus(userId: string): Observable<any> {
    return this.api.get(`api/FaceId/verify/${userId}`);
  }

}
