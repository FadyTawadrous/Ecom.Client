import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api-service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { OrderStatusStepperComponent } from '../order-status-stepper/order-status-stepper-component';
import { MatDividerModule } from '@angular/material/divider';
import { MaterialModule } from '../../../shared/material/material-module';

@Component({
  standalone: true,
  selector: 'app-order-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    OrderStatusStepperComponent,
    MaterialModule
  ],
  templateUrl: './order-details.component.html', // Moved HTML to file
  styleUrls: ['./order-details.component.scss']   // Moved SCSS to file
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
    3: 'Delivered',
    4: 'Cancelled'
  };

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(id: string) {
    this.api.get<any>(`api/order/${id}`).subscribe(res => {
      if (res.isSuccess) {
        this.order.set(res.result);
      }
    });
  }

  // UPDATED: Just returns the lowercase status for CSS mapping
  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}