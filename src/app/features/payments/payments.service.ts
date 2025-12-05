import { Injectable, signal,inject } from '@angular/core';
import { ApiService } from '../../core/services/api-service';
import { Observable } from 'rxjs';
import { GetPaymentVM,CreatePaymentVM,PaymentResultVM } from '../../core/models/payment.models';
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

  /**
   * 1️⃣ Create a payment record (for COD / manual flow)
   * POST api/payment/create
   */
  createPayment(model: CreatePaymentVM): Observable<GetPaymentVM> {
    return this.api.post<GetPaymentVM>('api/payment/create', model);
  }
  

  updatePaymentStatus(model: PaymentResultVM): Observable<any> {
    return this.api.post<any>('api/payment/webhook', model);
  }

  /** Admin: get all payments */
  getAllPayments(): Observable<GetPaymentVM[]> {
    return this.api.get<GetPaymentVM[]>('api/payment/payments');
  }

  /** Admin: toggle delete payment */
  toggleDelete(id: number): Observable<any> {
    return this.api.delete<any>(`api/payment/${id}`);
  }
  /** Get payment by Order ID */
  getPaymentByOrder(orderId: number): Observable<GetPaymentVM> {
    return this.api.get<GetPaymentVM>(`api/payment/payment/${orderId}`);
  }
}
