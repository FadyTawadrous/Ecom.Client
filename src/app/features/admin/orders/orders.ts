import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../services/admin-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {

  orders: any[] = [];
  allOrders: any[] = [];
  selectedOrder: any = null;

  loading = false;

  filters = {
    orderNumber: '',
    user: '',
    status: ''
  };

  statusList: string[] = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned'
  ];

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // ================= LOAD =================
  loadOrders() {
    this.loading = true;
    this.adminApi.getOrders().subscribe(res => {
      this.orders = res.result;
      this.allOrders = [...this.orders];
      this.loading = false;
    });
  }

  // ================= DETAILS =================
  viewOrder(id: number) {
    this.adminApi.getOrderDetails(id).subscribe(res => {
      this.selectedOrder = res.result;
    });
  }

  // ================= STATUS =================
  onStatusChange(order: any, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value;

    if (!newStatus) return;

    this.updateStatus(order, newStatus);
  }

  updateStatus(order: any, newStatus: string) {
    this.adminApi.updateOrderStatus(order.id, newStatus).subscribe(() => {
      this.loadOrders();
      if (this.selectedOrder?.id === order.id) {
        this.viewOrder(order.id);
      }
    });
  }

  // ================= CANCEL =================
  cancelOrder(id: number) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    this.adminApi.cancelOrder(id).subscribe(() => {
      this.loadOrders();
      if (this.selectedOrder?.id === id) {
        this.selectedOrder = null;
      }
    });
  }

  // ================= FILTER =================
  applyFilters() {
    this.orders = this.allOrders.filter(o => {

      const matchOrderNumber =
        !this.filters.orderNumber ||
        o.orderNumber?.toLowerCase().includes(this.filters.orderNumber.toLowerCase());

      const matchUser =
        !this.filters.user ||
        o.userName?.toLowerCase().includes(this.filters.user.toLowerCase()) ||
        o.email?.toLowerCase().includes(this.filters.user.toLowerCase()) ||
        o.appUserId?.toLowerCase().includes(this.filters.user.toLowerCase());

      const matchStatus =
        !this.filters.status || o.status === this.filters.status;

      return matchOrderNumber && matchUser && matchStatus;
    });
  }

  resetFilters() {
    this.filters = {
      orderNumber: '',
      user: '',
      status: ''
    };
    this.orders = [...this.allOrders];
  }

}
