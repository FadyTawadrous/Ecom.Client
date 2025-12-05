import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { AuthService } from '../../../core/services/auth-service';

import { MaterialModule } from '../../../shared/material/material-module';

import { MatDialog } from '@angular/material/dialog';
import { FaceCaptureComponent } from '../../../shared/components/face-capture-component/face-capture-component';
import { FaceIdService } from '../../../core/services/face-id-service';
import { ChangePasswordComponent } from '../change-password-component/change-password-component';

@Component({
  selector: 'app-profile-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss',
})
export class ProfileComponent {

  // Inject dependencies
  authService = inject(AuthService); // Public so template can access currentUser signal
  private fb = inject(FormBuilder);
  private faceService = inject(FaceIdService);
  private dialog = inject(MatDialog);

  // State Signals
  isLoading = signal(false);
  currentImage = signal<string | undefined>(undefined);
  hasFaceId = signal(false); // Signal to track status
  selectedFile: File | null = null;


  profileForm: FormGroup = this.fb.group({
    email: [{ value: '', disabled: true }], // Read-only
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    phoneNumber: ['']
  });

  constructor() {
    // EFFECT: When the signal (currentUser) changes, update the form
    // This runs automatically whenever AuthService updates the user state.
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.profileForm.patchValue({
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber
        });

        // Handle Image URL (Assuming backend returns full URL or relative path)
        // If relative, prepend API URL here or in a pipe
        this.currentImage.set(user.profileImageUrl);
        this.checkFaceStatus(user.id);

        // if (user.profileImageUrl) {
        //    const fullUrl = `${environment.apiURL}/Files/Images/UserImages/${user.profileImageUrl}`;
        //    this.currentImage.set(fullUrl);
        // }
        // else {
        //   //this.currentImage.set(undefined);
        //   this.currentImage.set(`${environment.apiURL}/Files/Images/UserImages/default-profile.png`);
        // }

      }
    });
  }

  // Handle broken image links (e.g. file deleted on server)
  handleImageError(event: any) {
    // If the image fails to load, switch to the default image in assets
    //event.target.src = this.defaultImage;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create a preview URL immediately for better UX
      const reader = new FileReader();
      reader.onload = (e) => this.currentImage.set(e.target?.result as string);
      reader.readAsDataURL(this.selectedFile);

      // Mark form as dirty so Save button enables
      this.profileForm.markAsDirty();
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);

    // 1. Prepare FormData
    const formData = new FormData();
    formData.append('displayName', this.profileForm.get('displayName')?.value);
    formData.append('phoneNumber', this.profileForm.get('phoneNumber')?.value || '');

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    // 2. Call Service
    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.selectedFile = null; // Reset file selection
        this.profileForm.markAsPristine(); // Disable save button until next change
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  // registerFace() {
  //   const dialogRef = this.dialog.open(FaceCaptureComponent, { width: '350px' });

  //   dialogRef.afterClosed().subscribe(file => {
  //     if (file) {
  //       this.isLoading.set(true);
  //       this.faceService.registerFace(file).subscribe({
  //         next: () => this.isLoading.set(false),
  //         error: () => this.isLoading.set(false)
  //       });
  //     }
  //   });
  // }

  registerFace() {
    const dialogRef = this.dialog.open(FaceCaptureComponent, { width: '350px' });

    dialogRef.afterClosed().subscribe(file => {
      if (file) {
        this.isLoading.set(true);
        // Call register or update based on current status
        const action$ = this.hasFaceId()
          ? this.faceService.registerFace(file) // Or updateFace if you have a distinct endpoint
          : this.faceService.registerFace(file);

        action$.subscribe({
          next: () => {
            this.isLoading.set(false);
            this.hasFaceId.set(true); // Update UI state immediately
          },
          error: () => this.isLoading.set(false)
        });
      }
    });
  }

  checkFaceStatus(userId: string) {
    this.faceService.checkFaceIdStatus(userId).subscribe({
      next: (response: any) => {
        // 1. Check if the response is your standard ResponseResult (Success)
        // Your ResponseResult object has an 'isSuccess' property.
        // The anonymous object { hasFace: false } DOES NOT have 'isSuccess'.
        if (response && response.isSuccess) {
          this.hasFaceId.set(true);
        } else {
          // This catches { hasFace: false } or any failed ResponseResult
          this.hasFaceId.set(false);
        }
      },
      error: () => {
        // This handles actual network errors (500 Server Error, offline, etc.)
        this.hasFaceId.set(false);
      }
    });
  }

  openChangePassword() {
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      disableClose: true
    });
  }

}
