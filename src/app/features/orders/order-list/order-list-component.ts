import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { OrderService } from '../../../core/services/order-service';
import { OrderDTO } from '../../../core/models/order.models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <h1>My Orders</h1>

    <!-- Loading Indicator -->
    <p *ngIf="loading()">Loading orders...</p>

    <!-- Empty State -->
    <p *ngIf="!loading() && orders().length === 0">
      You haven't placed any orders yet.
    </p>

    <!-- Orders List -->
    <mat-accordion *ngIf="orders().length > 0 && !loading()">
      <mat-expansion-panel *ngFor="let order of orders()">
        <mat-expansion-panel-header>

          <mat-panel-title>
            #{{ order.id }} — {{ order.totalAmount | currency }}
          </mat-panel-title>

          <mat-panel-description>
            <mat-chip [color]="statusColor(order.status)" selected>
              {{ order.status }}
            </mat-chip>
          </mat-panel-description>

        </mat-expansion-panel-header>

        <div class="order-body">
          <p><strong>Placed:</strong> {{ order.createdOn | date }}</p>
          <p><strong>Delivery:</strong> {{ order.deliveryDate | date }}</p>

          <h4>Items</h4>
          <ul>
            <li *ngFor="let i of order.items">
              {{ i.productName }} (x{{ i.quantity }}) —
              {{ i.totalPrice | currency }}
            </li>
          </ul>

          <button mat-raised-button color="primary" (click)="viewOrder(order.id)">
            View Details
          </button>
        </div>

      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [`
    .order-body { padding: 15px; }
  `]
})
export class OrderListComponent implements OnInit {

  private orderService = inject(OrderService);
  private router = inject(Router);

  orders = signal<OrderDTO[]>([]);
  loading = signal<boolean>(false);

  // TEMP: replace with real logged-in user ID
  userId = '081d0d65-8f7b-4375-afd2-81cf2664fe6e';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);

    this.orderService.getOrdersByUser(this.userId).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Failed to load orders", err);
        this.loading.set(false);
      }
    });
  }

  viewOrder(id: number) {
    this.router.navigate(['/orders/details', id]);
  }

  statusColor(status: string) {
    switch (status) {
      case 'Pending': return 'warn';
      case 'Processing': return 'accent';
      case 'Shipped': return 'primary';
      case 'Delivered': return 'primary';
      default: return '';
    }
  }
}
