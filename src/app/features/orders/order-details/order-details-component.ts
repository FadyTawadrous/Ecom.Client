import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api-service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { OrderStatusStepperComponent } from '../order-status-stepper/order-status-stepper-component';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  standalone: true,
  selector: 'app-order-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    OrderStatusStepperComponent
  ],
  template: `
    <div class="order-details-container">

  <h1 class="page-title">Order Details</h1>

  <!-- Status Stepper -->
  <app-order-status-stepper
    class="status-stepper"
    [status]="order()?.status">
  </app-order-status-stepper>

  <mat-card class="order-card" *ngIf="order() as o">

    <!-- HEADER -->
    <div class="order-header">
      <div>
        <h2>Order #{{ o.id }}</h2>
        <p class="sub">Placed on {{ o.createdOn | date }}</p>
      </div>

      <div class="status-badge" [ngClass]="o.status.toLowerCase()">
        {{ o.status }}
      </div>
    </div>

    <mat-divider></mat-divider>

    <!-- ORDER INFO -->
    <div class="info-grid">

      <div class="info-item">
        <h4>Status</h4>
        <p>{{ o.status }}</p>
      </div>

      <div class="info-item">
        <h4>Tracking Number</h4>
        <p>
          {{ o.trackingNumber || 'Not assigned yet' }}
        </p>
      </div>

      <div class="info-item">
        <h4>Delivery Date</h4>
        <p>
          {{ o.deliveryDate ? (o.deliveryDate | date) : 'Pending' }}
        </p>
      </div>

    </div>

    <mat-divider></mat-divider>

    <!-- ITEMS SECTION -->
    <h3 class="section-title">Items</h3>

    <table mat-table [dataSource]="o.items" class="items-table mat-elevation-z1">

      <!-- Product Column -->
      <ng-container matColumnDef="productName">
        <th mat-header-cell *matHeaderCellDef>Product</th>
        <td mat-cell *matCellDef="let item">
          <div class="row-product">
            <div class="title">{{ item.productTitle }}</div>
          </div>
        </td>
      </ng-container>

      <!-- Qty -->
      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Qty</th>
        <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
      </ng-container>

      <!-- Total -->
      <ng-container matColumnDef="totalPrice">
        <th mat-header-cell *matHeaderCellDef>Total</th>
        <td mat-cell *matCellDef="let item">
          {{ item.totalPrice | currency }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>

    <!-- ORDER TOTAL -->
    <div class="order-total">
      <h2>Total Amount:</h2>
      <span>{{ o.totalAmount | currency }}</span>
    </div>

  </mat-card>
</div>

  `,
  styles: `.order-details-container {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
}

.status-stepper {
  margin-bottom: 25px;
}

.order-card {
  padding: 25px;
  border-radius: 14px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sub {
    color: #666;
    font-size: 14px;
  }
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
  color: white;

  &.pending {
    background-color: #f5a623;
  }
  &.processing {
    background-color: #1976d2;
  }
  &.shipped {
    background-color: #42a5f5;
  }
  &.delivered {
    background-color: #4caf50;
  }
  &.cancelled {
    background-color: #d32f2f;
  }
}

.info-grid {
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  .info-item {
    h4 {
      margin: 0;
      font-weight: 600;
      font-size: 14px;
      color: #555;
    }

    p {
      margin-top: 4px;
      font-size: 16px;
      font-weight: 500;
    }
  }
}

.section-title {
  margin-top: 25px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 600;
}

.items-table {
  width: 100%;
  margin-bottom: 20px;

  .row-product {
    display: flex;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 500;
    }
  }
}

.order-total {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;

  span {
    color: #1976d2;
  }
}
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
