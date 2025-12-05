import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentStateService {

  totalAmount = signal<number>(0);

  setTotal(amount: number) {
    this.totalAmount.set(amount);
  }

  getTotal() {
    return this.totalAmount();
  }
}
