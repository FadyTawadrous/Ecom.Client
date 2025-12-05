import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { AddressStepComponent } from './steps/address-step.component';
// import { DeliveryStepComponent } from './steps/delivery-step.component';
// import { PaymentMethodStepComponent } from './steps/payment-method-step.component';
import { SummaryStepComponent } from './steps/summery-step.component';

import { PaymentStateService } from '../../core/services/payment-state-service';

@Component({
  standalone: true,
  selector: 'app-payment',
  imports: [
    CommonModule,
    MatStepperModule,
    AddressStepComponent,
    // DeliveryStepComponent,
    // PaymentMethodStepComponent,
    SummaryStepComponent,
  ],
  templateUrl: './payments.component.html'
})
export class PaymentsComponent {

  paymentState = inject(PaymentStateService);
  total = this.paymentState.getTotal();
}
