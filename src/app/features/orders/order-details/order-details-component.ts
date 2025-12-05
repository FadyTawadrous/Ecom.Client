import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api-service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { OrderStatusStepperComponent } from '../order-status-stepper/order-status-stepper-component';

@Component({
  standalone: true,
  selector: 'app-order-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    OrderStatusStepperComponent
  ],
  template: `
    <h1>Order Details</h1>

    <app-order-status-stepper
      [status]="order()?.status">
    </app-order-status-stepper>

    <mat-card *ngIf="order()">

      <h2>Order #{{ order()?.id }}</h2>

      <p><strong>Status:</strong> {{ statusLabels[order()?.status] }}</p>
      <p><strong>Tracking:</strong> {{ order()?.trackingNumber || 'Tracking Id not assigned' }}</p>
      <p><strong>Delivery Date:</strong> {{ order()?.deliveryDate | date }}</p>

      <h3>Items</h3>

      <table mat-table [dataSource]="order()?.items">

        <ng-container matColumnDef="productName">
          <th mat-header-cell *matHeaderCellDef> Product </th>
          <td mat-cell *matCellDef="let item"> {{ item.productTitle }} </td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef> Qty </th>
          <td mat-cell *matCellDef="let item"> {{ item.quantity }} </td>
        </ng-container>

        <ng-container matColumnDef="totalPrice">
          <th mat-header-cell *matHeaderCellDef> Total </th>
          <td mat-cell *matCellDef="let item"> {{ item.totalPrice | currency }} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>

      </table>

      <h3>Total Amount: {{ order()?.totalAmount | currency }}</h3>

    </mat-card>
  `
})
export class OrderDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  order = signal<any | null>(null);
  columns = ['productName', 'quantity', 'totalPrice'];

  statusLabels: Record<number, string> = {
  0: 'Pending',
  1: 'Processing',
  2: 'Shipped',
  3: 'Delivered'
};

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    this.loadOrder(orderId!);
  }

  loadOrder(id: string) {
    this.api.get<any>(`api/order/${id}`).subscribe(res => {
      if (res.isSuccess) {
        this.order.set(res.result);
      }
    });
  }
}
