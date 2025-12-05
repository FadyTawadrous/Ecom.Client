import { Routes } from '@angular/router';

import { PaymentsComponent } from './payments.component';
import { AddressStepComponent } from './steps/address-step.component';
// import { DeliveryStepComponent } from './steps/delivery-step.component';
// import { PaymentMethodStepComponent } from './steps/payment-method-step.component';
import { SummaryStepComponent } from './steps/summery-step.component';

import { PaymentSuccessComponent } from './payment-success.component';
import { PaymentCancelComponent } from './payment-cancel.component';

export const PAYMENT_ROUTES: Routes = [

  // 1️⃣ Stripe redirect pages MUST come first
  // { path: 'success/:orderId', component: PaymentSuccessComponent },
  // { path: 'cancel', component: PaymentCancelComponent },

  // 2️⃣ Checkout wizard
  {
    path: '',
    component: PaymentsComponent,
    children: [
      { path: 'address', component: AddressStepComponent },
      // { path: 'delivery', component: DeliveryStepComponent },
      // { path: 'payment-method', component: PaymentMethodStepComponent },
      { path: 'summary', component: SummaryStepComponent },

      // 3️⃣ Default route – redirect to address
      { path: '', redirectTo: 'address', pathMatch: 'full' }
    ]
  }
];
