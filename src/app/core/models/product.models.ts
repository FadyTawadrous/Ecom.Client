// Main Product Interface
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  quantitySold: number;
  thumbnailUrl: string | null;
  brandId: number;
  brandName: string | null;
  categoryId: number;
  categoryName: string | null;
  isDeleted: boolean;
  
  reviews?: ProductReview[];
  productImageUrls?: ProductImageUrl[];
}

// Product Image Interface
export interface ProductImageUrl {
  id: number;
  imageUrl: string;
  productId: number;
  ProductName: string;
 
}

// Product Review Interfaces
export interface ProductReviewCreate {
  title: string;
  description: string;
  rating: number;
  productId: number;
  appUserId: string;
  createdBy: string;
}

export interface ProductReview {
  id: number;
  title: string;
  description: string;
  rating: number;
  createdBy: string | null;
  createdOn: string; // Use Date if you'll convert from string
  updatedBy: string | null;
  updatedOn: string | null;
  isDeleted: boolean;
  
  // Relation keys
  productId: number;
  appUserId: string;
  
  // Extra read-only fields for display
  productTitle: string | null;
  appUserDisplayName: string | null;
}

export interface ProductReviewUpdate {
  id: number;
  title: string;
  description: string;
  rating: number;
  updatedBy: string;
}

// Category Interface
export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  
 
}

// Brand Interface
export interface Brand {
  id: number;
  name: string | null;
  imageUrl: string | null;
  isDeleted: boolean;
}

// Filter & Search Interfaces
export interface ProductFilter {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: 'price' | 'rating' | 'name'|'price' ;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

