import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CreatePaymentVM, PaymentMethod, PaymentStatus, PaymentResultVM } from '../../../core/models/payment.models';
import { AuthService } from '../../../core/services/auth-service';
import { PaymentService } from '../payments.service';
import { PaymentStateService } from '../../../core/services/payment-state-service';
import { OrderService } from '../../../core/services/order-service';
import { StripeService } from '../../../core/services/stripe-service';
import { MaterialModule } from '../../../shared/material/material-module';

@Component({
  selector: 'app-summary-step',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MaterialModule,
  ],
  template: `
    <div class="summary-step">
  <mat-card class="summary-card">
    
    <div class="card-header">
      <div class="icon-circle">
        <mat-icon>assignment_turned_in</mat-icon>
      </div>
      <h2 class="title">Order Summary</h2>
      <p class="subtitle">Please review your details before completing the order.</p>
    </div>

    <div class="card-content">
      
      <div class="info-block full-width">
        <div class="block-header">
          <mat-icon>location_on</mat-icon>
          <span>Shipping Address</span>
        </div>
        <div class="block-body">
          <p class="primary-text">{{ service.addressData()?.street }}</p>
          <p class="secondary-text">
            {{ service.addressData()?.city }}, {{ service.addressData()?.country }}
          </p>
        </div>
      </div>

      <div class="split-row">
        <div class="info-block">
          <div class="block-header">
            <mat-icon>local_shipping</mat-icon>
            <span>Delivery</span>
          </div>
          <div class="block-body">
            <p class="primary-text capitalize">{{ service.deliveryType() }}</p>
            <p class="secondary-text">Standard Shipping</p>
          </div>
        </div>

        <div class="info-block">
          <div class="block-header">
            <mat-icon>credit_card</mat-icon>
            <span>Payment</span>
          </div>
          <div class="block-body">
            <p class="primary-text">Stripe Secure</p>
            <p class="secondary-text">**** **** **** 4242</p>
          </div>
        </div>
      </div>

    </div>

    <mat-divider></mat-divider>

    <div class="card-footer">
      <div class="total-section">
        <span class="label">Total Amount</span>
        <span class="value">{{ total | currency }}</span>
      </div>

      <button mat-flat-button class="place-order-btn" (click)="placeOrder()">
        <span>Place Order</span>
        <mat-icon>arrow_forward</mat-icon>
      </button>
    </div>

  </mat-card>
</div>
  `,
  styles: [`
    /* --- Earthy Minimalist Variables --- */
$bg-card: #FFFFFF;       // White
$text-primary: #2C2C2C;  // Charcoal
$text-secondary: #57534E;// Warm Grey
$accent: #5D5C52;        // Olive
$border: #D6D3D1;        // Stone
$hover-bg: #F5F5F4;      // Light Stone

/* --- Layout --- */
.summary-step {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  background-color: #E6E5DF;
}

/* --- Main Card --- */
.summary-card {
  width: 100%;
  max-width: 600px;
  background-color: $bg-card;
  border: 1px solid $border;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border-radius: 4px; // Square-ish corners
  padding: 40px !important; // Override default padding
}

/* --- Header --- */
.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 40px;

  .icon-circle {
    width: 64px;
    height: 64px;
    background-color: $hover-bg;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    border: 1px solid $border;

    mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: $accent;
    }
  }

  .title {
    font-family: 'Garamond', serif;
    font-size: 32px;
    font-weight: 500;
    color: $text-primary;
    margin: 0 0 8px 0;
  }

  .subtitle {
    color: $text-secondary;
    font-size: 14px;
    margin: 0;
  }
}

/* --- Content Blocks --- */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.info-block {
  background-color: #FAFAFA;
  border: 1px solid $border;
  padding: 20px;
  border-radius: 4px;

  .block-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: $text-secondary;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;

    mat-icon { font-size: 18px; width: 18px; height: 18px; }
  }

  .block-body {
    .primary-text {
      font-size: 16px;
      font-weight: 500;
      color: $text-primary;
      margin: 0 0 4px 0;
      line-height: 1.4;
      
      &.capitalize { text-transform: capitalize; }
    }
    
    .secondary-text {
      font-size: 14px;
      color: $text-secondary;
      margin: 0;
    }
  }
}

/* --- Footer / Total --- */
.card-footer {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  .total-section {
    text-align: center;
    
    .label {
      display: block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: $text-secondary;
      margin-bottom: 8px;
    }
    
    .value {
      font-family: 'Garamond', serif;
      font-size: 40px;
      font-weight: 500;
      color: $text-primary;
      line-height: 1;
    }
  }

  .place-order-btn {
    width: 100%;
    height: 56px;
    background-color: $accent;
    color: white;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    border-radius: 0; // Square button
    
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    mat-icon { transition: transform 0.2s; }

    &:hover {
      background-color: darken($accent, 5%);
      mat-icon { transform: translateX(4px); }
    }
  }
}
  `]
})




export class SummaryStepComponent {

  service = inject(PaymentService);
  paymentState = inject(PaymentStateService);
  orderService = inject(OrderService);
  router = inject(Router);
  stripeService = inject(StripeService);
  auth = inject(AuthService);
  paymentApi = inject(PaymentService);
  get total() {
    return this.paymentState.getTotal();
  }



  placeOrder() {

    const addr = this.service.addressData();
    if (!addr) return;

    const shippingAddress = `${addr.street}, ${addr.city}, ${addr.country}, ${addr.zipCode}`;

    // 1️⃣ Create Order
    this.orderService.createOrder(shippingAddress).subscribe({
      next: (orderRes) => {

        if (!orderRes.isSuccess || !orderRes.result) {
          console.error("Order creation failed");
          return;
        }

        const orderId = orderRes.result.id;

        // 2️⃣ Create Payment Record BEFORE Stripe Call
        const paymentModel: CreatePaymentVM = {
          orderId: orderId,
          paymentMethod: PaymentMethod.Card,
          totalAmount: this.paymentState.getTotal(),
          createdBy: this.auth.currentUser()?.id
        };
        console.log(paymentModel);

        this.paymentApi.createPayment(paymentModel).subscribe({
          next: (paymentRes) => {

            if (!paymentRes || !paymentRes.id) {
              console.error("Payment creation failed");
              return;
            }

            const paymentId = paymentRes.id;

            // 3️⃣ Create Stripe Session (new version with isSuccess)
            this.stripeService.createCheckoutSession(orderId).subscribe({
              next: (sessionRes) => {

                if (!sessionRes || !sessionRes.url) {
                  console.error("Stripe session failed");
                  return;
                }
                window.location.href = sessionRes.url!;
                // const status = sessionRes.isSuccess
                //     ? PaymentStatus.Completed
                //     : PaymentStatus.Failed;

                //     console.log("Stripe session response:", sessionRes);

                // // 4️⃣ Update Payment Status BEFORE redirect
                // const statusModel: PaymentResultVM = {
                //     paymentId: paymentId,
                //     transactionId: null,
                //     status: status
                // };

                // this.paymentApi.updatePaymentStatus(statusModel).subscribe({
                //     next: () => {
                //         console.log("Payment status updated:", status);

                //         // 5️⃣ Redirect user to Stripe
                //         window.location.href = sessionRes.url!;
                //     },
                //     error: err => console.error("Payment status update failed", err)
                // });

              },
              error: err => console.error("Stripe session error:", err)
            });

          },
          error: err => console.error("Payment creation error:", err)
        });

      },
      error: err => console.error("Order reation error:", err)
    });
  }


}
