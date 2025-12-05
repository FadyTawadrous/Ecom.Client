// ====================================================================
// CART + CART ITEM DTOs — Angular models matching backend ViewModels
// ====================================================================

// ---------------------------------------------------------
// 1️⃣ CART ITEM DTOs
// ---------------------------------------------------------

// GetCartItemVM
export interface GetCartItemDTO {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  cartId: number;
  productId: number;
  productName: string;

  createdBy?: string | null;
  createdOn: string;
  deletedOn?: string | null;
  deletedBy?: string | null;
  updatedOn?: string | null;
  updatedBy?: string | null;

  isDeleted: boolean;
}

// AddCartItemVM
export interface AddCartItemDTO {
  cartId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  createdBy: string;
  appUserId: string ;
  totalPrice: number;
}

// UpdateCartItemVM
export interface UpdateCartItemDTO {
  id: number;
  quantity: number;
  unitPrice: number;
  cartId: number;
  productId: number;
  updatedBy?: string | null;
}

// DeleteCartItemVM
export interface DeleteCartItemDTO {
  id: number;
  quantity: number;
  productId: number;
  deletedBy: string;
}

// ---------------------------------------------------------
// 2️⃣ CART DTOs
// ---------------------------------------------------------

// GetCartVM
export interface GetCartDTO {
  id: number;
  totalAmount: number;     // readonly in backend
  appUserId: string;
  cartItems: GetCartItemDTO[];

  createdBy?: string | null;
  createdOn: string;
}

// AddCartVM
export interface AddCartDTO {
  appUserId: string;
  createdBy: string;
}

// UpdateCartVM
export interface UpdateCartDTO {
  id: number;
  appUserId: string;
  updatedBy: string;
}

// DeleteCartVM
export interface DeleteCartDTO {
  id: number;
  deletedBy: string;
}

// ====================================================================
// END OF FILE
// ====================================================================
