import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';

import { MaterialModule } from '../../../shared/material/material-module';

@Component({
  selector: 'app-confirm-email-component',
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './confirm-email-component.html',
  styleUrl: './confirm-email-component.scss',
})

export class ConfirmEmailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  // UI State Signals
  isLoading = signal(true);
  isSuccess = signal(false);
  errorMessage = signal('The link might be invalid or expired.');

  ngOnInit() {
    // 1. Get query params from URL
    const userId = this.route.snapshot.queryParams['userId'];
    const code = this.route.snapshot.queryParams['code'];

    if (!userId || !code) {
      this.isLoading.set(false);
      this.isSuccess.set(false);
      this.errorMessage.set('Invalid verification link.');
      return;
    }

    // 2. Call API
    this.confirmEmail(userId, code);
  }

  confirmEmail(userId: string, code: string) {
    this.authService.confirmEmail(userId, code).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isSuccess.set(false);
        // If the backend sends specific error text, use it
        if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else if (typeof err.error === 'string') {
          this.errorMessage.set(err.error);
        }
      }
    });
  }

}
