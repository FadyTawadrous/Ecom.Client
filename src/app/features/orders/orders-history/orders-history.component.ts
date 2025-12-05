import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ApiService } from '../../../core/services/api-service';
import { MaterialModule } from '../../../shared/material/material-module';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  standalone: true,
  selector: 'app-orders-history',
  imports: [CommonModule, MaterialModule],
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.scss']
})
export class OrdersHistoryComponent implements OnInit {

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  orders = signal<any[]>([]);

  statusLabels: Record<number, string> = {
    0: 'Pending',
    1: 'Processing',
    2: 'Shipped',
    3: 'Delivered'
  };

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      this.loadOrders(user.id);
    }
  }

  loadOrders(userId: string) {
    this.api.get<any>(`api/order/user/${userId}`).subscribe(res => {
      if (res.isSuccess) this.orders.set(res.result);
    });
  }

  openOrder(id: number) {
    this.router.navigate(['/orders', id]);
  }
}
