import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-order-status-stepper',
  standalone: true,
  imports: [CommonModule, MatStepperModule],
  template: `
    <mat-horizontal-stepper [selectedIndex]="currentStep" linear>
      <mat-step label="Pending"></mat-step>
      <mat-step label="Processing"></mat-step>
      <mat-step label="Shipped"></mat-step>
      <mat-step label="Delivered"></mat-step>
    </mat-horizontal-stepper>
  `
})
export class OrderStatusStepperComponent {

  @Input() status!: string;

  get currentStep() {
    switch (this.status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  }
}
