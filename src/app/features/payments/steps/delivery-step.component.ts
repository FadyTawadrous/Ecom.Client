// import { Component, Input, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   Validators
// } from '@angular/forms';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatStepper } from '@angular/material/stepper';
// import { MatError} from '@angular/material/form-field';
// import { PaymentService } from '../payments.service';

// @Component({
//   standalone: true,
//   selector: 'app-delivery-step',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatRadioModule,
//     MatCardModule,
//     MatError,
//     MatButtonModule
//   ],
//   template: `
//     <form [formGroup]="form" class="step-form">

//       <h2>Delivery Options</h2>

//       <mat-radio-group formControlName="type" class="delivery-options">

//         <mat-card class="option-card">
//           <mat-radio-button value="Standard">Standard — FREE</mat-radio-button>
//         </mat-card>

//         <mat-card class="option-card">
//           <mat-radio-button value="Express">Express — $10</mat-radio-button>
//         </mat-card>

//       </mat-radio-group>

//       <mat-error *ngIf="form.controls.type.invalid">Choose a delivery option</mat-error>

//       <button mat-raised-button color="primary"
//               (click)="next()"
//               [disabled]="form.invalid">
//         Continue
//       </button>

//     </form>
//   `
// })
// export class DeliveryStepComponent {

//   @Input() stepper!: MatStepper;

//   private fb = inject(FormBuilder);
//   private service = inject(PaymentService);

//   form = this.fb.group({
//     type: ['', Validators.required]
//   });

//   next() {
//     if (!this.form.valid) return;

//     const type = this.form.value.type;

//     this.service.saveDelivery({
//       type,
//       cost: type === "Express" ? 10 : 0
//     });

//     console.log("Delivery saved:", this.service.deliveryData());

//     this.stepper.next();
//   }
// }
