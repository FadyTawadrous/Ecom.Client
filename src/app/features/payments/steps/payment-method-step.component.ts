// import { Component, Input, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   Validators
// } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatStepper } from '@angular/material/stepper';

// import { PaymentService } from '../payments.service';

// @Component({
//   standalone: true,
//   selector: 'app-payment-method-step',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule
//   ],
//   template: `
//     <form [formGroup]="form" class="step-form">

//       <h2>Payment Method</h2>

//       <mat-form-field appearance="outline">
//         <mat-label>Card Number</mat-label>
//         <input matInput formControlName="cardNumber">
//         <mat-error *ngIf="form.controls.cardNumber.invalid">
//           Card number is required
//         </mat-error>
//       </mat-form-field>

//       <button mat-raised-button color="primary"
//               (click)="next()"
//               [disabled]="form.invalid">
//         Continue
//       </button>

//     </form>
//   `
// })
// export class PaymentMethodStepComponent {

//   @Input() stepper!: MatStepper;

//   private fb = inject(FormBuilder);
//   private service = inject(PaymentService);

//   form = this.fb.group({
//     cardNumber: ['', Validators.required]
//   });

//   next() {
//     if (!this.form.valid) return;

//     this.service.savePayment({ ...this.form.value });

//     console.log("Payment saved:", this.service.paymentData());

//     this.stepper.next();
//   }
// }
