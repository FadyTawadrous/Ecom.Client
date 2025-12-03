export interface ProductReview {
  id: number;
  title: string;
  description: string;
  rating: number;
  createdBy?: string;
  createdOn: string;      // Date from API as ISO string
  updatedBy?: string;
  updatedOn?: string;
  isDeleted: boolean;

  // Relations
  productId: number;
  appUserId: string;

  // Extra display fields
  productTitle?: string;
  appUserDisplayName?: string;
}


export interface ProductImage {
  id: number;
  imageUrl?: string;
  productId: number;
  productName?: string;
  createdBy?: string;
}


export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  quantitySold: number;
  thumbnailUrl?: string;
  brandId: number;
  brandName?: string;
  categoryId: number;
  categoryName?: string;
  isDeleted: boolean;

  reviews?: ProductReview[];
  productImageUrls?: ProductImage[];
}


export interface Brand {
  id: number;
  name?: string;
  imageUrl?: string;
  isDeleted: boolean;
}


export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  createdBy?: string;
  createdOn: string;
  deletedOn?: string;
  deletedBy?: string;
  updatedOn?: string;
  updatedBy?: string;
  isDeleted: boolean;
}

