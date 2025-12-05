export interface OrderItemDTO {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDTO {
  id: number;
  status: string;
  createdOn: string;
  deliveryDate: string;
  totalAmount: number;
  trackingNumber: string | null;
  items: OrderItemDTO[];
}
