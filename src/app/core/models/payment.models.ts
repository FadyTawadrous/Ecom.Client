// payment.models.ts

export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3
}

export enum PaymentMethod {
  Cash = 0,
  Card = 1,
  Paypal = 2
}

// For POST api/payment/create
export interface CreatePaymentVM {
  orderId: number;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  createdBy?: string | null;
}

// For GET api/payment/payment/{orderId}
export interface GetPaymentVM {
  id: number;
  paymentMethod?: PaymentMethod | null;
  status: PaymentStatus;
  totalAmount: number;
  transactionId?: string | null;
  orderId: number;
}

// For POST api/payment/webhook
export interface PaymentResultVM {
  paymentId: number;
  transactionId?: string | null;
  status: PaymentStatus;
}
