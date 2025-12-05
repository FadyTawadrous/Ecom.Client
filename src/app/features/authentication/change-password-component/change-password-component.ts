import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { MaterialModule } from '../../../shared/material/material-module';

import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-change-password-component',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MaterialModule],
  templateUrl: './change-password-component.html',
  styleUrl: './change-password-component.scss',
})
export class ChangePasswordComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<ChangePasswordComponent>);

  isLoading = signal(false);
  hideCurrent = signal(true);
  hideNew = signal(true);

  // Custom Validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirm = control.get('confirmNewPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  save() {
    if (this.passwordForm.invalid) return;
    this.isLoading.set(true);

    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {
          this.dialogRef.close(true);
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

}
