export interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  cartId: number;
  productId: number;
  productName: string;

  createdBy?: string;
  createdOn: string;
  deletedOn?: string;
  deletedBy?: string;
  updatedOn?: string;
  updatedBy?: string;
  isDeleted: boolean;
}


export interface Cart {
  id: number;
  totalAmount: number;
  appUserId: string;
  cartItems?: CartItem[];
  createdBy?: string;
  createdOn: string;
}