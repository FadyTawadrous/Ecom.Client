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

@Component({
    standalone: true,
    selector: 'app-summary-step',
    imports: [
        CommonModule,
        CurrencyPipe,
        MatCardModule,
        MatButtonModule
    ],
    template: `
    <mat-card class="summary-card p-4">

  <h2 class="mb-3">Order Summary</h2>

  <!-- Shipping -->
  <section class="mb-4">
    <h3 class="section-title">Shipping Address</h3>
    <p class="section-text">
      {{ service.addressData()?.street }}<br>
      {{ service.addressData()?.city }}, {{ service.addressData()?.country }}
    </p>
  </section>

  <!-- Delivery -->
  <section class="mb-4">
    <h3 class="section-title">Delivery</h3>
    <p class="section-text">
      {{ service.deliveryType() }}
    </p>
  </section>

  <!-- Payment -->
  <section class="mb-4">
    <h3 class="section-title">Payment</h3>
    <p class="section-text">
      Paid with <strong>Stripe</strong>
    </p>
  </section>

  <!-- Total -->
  <section class="mb-4">
    <h3 class="section-title">Total Amount</h3>
    <p class="total-amount">
      {{ total | currency }}
    </p>
  </section>

  <!-- Button -->
  <div class="mt-4 text-center">
    <button mat-raised-button color="primary" (click)="placeOrder()">
      Place Order
    </button>
  </div>

</mat-card>

  `,
  styles: `.summary-card {
  padding: 24px;
  border-radius: 12px;
}

.section-title {
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 1.1rem;
}

.section-text {
  margin: 0;
  color: #555;
  line-height: 1.4;
}

.total-amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2e7d32; /* Material Green for emphasis */
}

.mb-3 { margin-bottom: 16px; }
.mb-4 { margin-bottom: 20px; }
.mt-4 { margin-top: 20px; }
.text-center { text-align: center; }
`
}
 
    )




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
