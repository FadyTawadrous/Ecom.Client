import { Injectable, signal,inject } from '@angular/core';
import { ApiService } from '../../core/services/api-service';
@Injectable({ providedIn: 'root' })
export class PaymentService {

  api = inject(ApiService);

  // Address entered in Step 1
  addressData = signal<any>(null);

  // Default shipping type (since delivery step removed)
  deliveryType = signal<'Standard' | 'Express'>('Standard');

  // Total amount from cart (PaymentStateService handles it)
  total = signal<number>(0);

  saveAddress(data: any) {
    this.addressData.set(data);
  }

  // Useful only if you later add Express option dynamically
  setDelivery(type: 'Standard' | 'Express') {
    this.deliveryType.set(type);
  }

  setTotal(amount: number) {
    this.total.set(amount);
  }
}
