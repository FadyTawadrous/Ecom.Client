import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-payment-cancel',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="cancel-container">
      <h1>⚠️ Payment Cancelled</h1>
      <p>Your payment did not go through.</p>
      <p>You can try again or return to your cart.</p>

      <button mat-raised-button color="primary" routerLink="/payment">
        Retry Payment
      </button>

      <button mat-stroked-button color="warn" routerLink="/cart">
        Return to Cart
      </button>
    </mat-card>
  `,
  styles: [`
    .cancel-container {
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      text-align: center;
    }
    button {
      margin: 10px;
    }
  `]
})
export class PaymentCancelComponent {}
