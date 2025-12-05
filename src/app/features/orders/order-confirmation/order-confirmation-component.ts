import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-order-confirmation',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <mat-card class="confirmation-card">
      <h1>🎉 Thank you for your order!</h1>
      <p>Your order #{{ orderId }} has been placed successfully.</p>

      <button mat-raised-button color="primary" (click)="viewOrder()">
        View Order
      </button>

      <button mat-button (click)="continueShopping()">
        Continue Shopping
      </button>
    </mat-card>
  `
})
export class OrderConfirmationComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  orderId = this.route.snapshot.paramMap.get('id');

  viewOrder() {
    this.router.navigate(['/orders/details', this.orderId]);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }
}
