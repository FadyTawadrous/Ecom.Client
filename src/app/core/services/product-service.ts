
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api-service';

import {
  Product,
  ProductFilter,
  ProductReview,
  ProductReviewCreate,
  ProductReviewUpdate,
  Category,
  Brand,
  ProductImageUrl
} from '../models/Product.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService = inject(ApiService);

  // ==================== PRODUCT ENDPOINTS ====================

  getAllProducts(filter?: ProductFilter): Observable<Product[]> {
    let params = new HttpParams();

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = filter[key as keyof ProductFilter];
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.apiService.get<Product[]>('Product/all', params);
  }

  getProductById(id: number): Observable<Product> {
    return this.apiService.get<Product>(`Product/${id}`);
  }

  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.apiService.get<Product[]>(`Product/brand/${brandId}`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.apiService.get<Product[]>(`Product/category/${categoryId}`);
  }

  searchProductsByTitle(title: string): Observable<Product[]> {
    const params = new HttpParams().set('title', title);
    return this.apiService.get<Product[]>('Product/search/title', params);
  }

  searchProductsByPrice(minPrice?: number, maxPrice?: number): Observable<Product[]> {
    let params = new HttpParams();
    
    if (minPrice !== undefined) {
      params = params.set('minPrice', minPrice.toString());
    }
    
    if (maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    return this.apiService.get<Product[]>('Product/search/price', params);
  }

  searchProductsByRating(minRating: number): Observable<Product[]> {
    const params = new HttpParams().set('minRating', minRating.toString());
    return this.apiService.get<Product[]>('Product/search/rating', params);
  }

  // ==================== PRODUCT IMAGE ENDPOINTS ====================


  //maybe needed later or not needed at all
  getAllProductImages(): Observable<ProductImageUrl[]> {
    return this.apiService.get<ProductImageUrl[]>('ProductImageUrl');
  }

  getProductImageById(id: number): Observable<ProductImageUrl> {
    return this.apiService.get<ProductImageUrl>(`ProductImageUrl/${id}`);
  }

  // ==================== PRODUCT REVIEW ENDPOINTS ====================

  getAllReviews(): Observable<ProductReview[]> {
    return this.apiService.get<ProductReview[]>('ProductReview');
  }

  getReviewsByProduct(productId: number): Observable<ProductReview[]> {
    return this.apiService.get<ProductReview[]>(`ProductReview/product/${productId}`);
  }

  getUserReviews(): Observable<ProductReview[]> {
    return this.apiService.get<ProductReview[]>('ProductReview/user');
  }

  getReviewsByBrand(brandId: number): Observable<ProductReview[]> {
    return this.apiService.get<ProductReview[]>(`ProductReview/brand/${brandId}`);
  }

  getReviewById(id: number): Observable<ProductReview> {
    return this.apiService.get<ProductReview>(`ProductReview/${id}`);
  }

  createReview(review: ProductReviewCreate): Observable<ProductReview> {
    return this.apiService.post<ProductReview>('ProductReview', review);
  }

  updateReview(review: ProductReviewUpdate): Observable<ProductReview> {
    return this.apiService.put<ProductReview>(`ProductReview/${review.id}`, review);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.apiService.delete<void>(`ProductReview/${reviewId}`);
  }

  // ==================== CATEGORY ENDPOINTS ====================

  getAllCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>('Category');
  }

  getCategoryById(id: number): Observable<Category> {
    return this.apiService.get<Category>(`Category/${id}`);
  }

  // ==================== BRAND ENDPOINTS ====================

  getAllBrands(): Observable<Brand[]> {
    return this.apiService.get<Brand[]>('Brand');
  }

  getBrandById(id: number): Observable<Brand> {
    return this.apiService.get<Brand>(`Brand/${id}`);
  }

  // In product.service.ts - Update the image handling methods

// ==================== IMAGE HANDLING METHODS ====================

getProductImageUrl(imagePath: string | null): string {
  if (!imagePath) {
    return `${environment.apiURL}/Files/Images/ProductImages/default-product.png`;
  }
  
  // If URL already starts with https, return as is
  if (imagePath.startsWith('https')) {
    return imagePath;
  }
  
  // If relative path, prepend API URL with product images path
  return `${environment.apiURL}/Files/Images/ProductImages/${imagePath}`;
}

getThumbnailUrl(product: Product): string {
  if (product.thumbnailUrl) {
    return this.getProductImageUrl(product.thumbnailUrl);
  }
  
  // Fallback to first product image or default
  if (product.productImageUrls && product.productImageUrls.length > 0) {
    return this.getProductImageUrl(product.productImageUrls[0].imageUrl);
  }
  
  return this.getProductImageUrl(null);
}


getProductGalleryImages(product: Product): string[] {
    if (!product.productImageUrls || product.productImageUrls.length === 0) {
      return [this.getProductImageUrl(null)];
    }

    return product.productImageUrls.map(img => this.getProductImageUrl(img.imageUrl));
  }
  // ==================== UTILITY METHODS ====================

  // calculateDiscountedPrice(price: number, discountPercentage: number): number {
  //   return price - (price * discountPercentage / 100);
  // }

  // formatPrice(price: number): string {
  //   return `$${price.toFixed(2)}`;
  // }

  // hasDiscount(product: Product): boolean {
  //   return product.discountPercentage > 0;
  // }

  // getFinalPrice(product: Product): number {
  //   if (this.hasDiscount(product)) {
  //     return this.calculateDiscountedPrice(product.price, product.discountPercentage);
  //   }
  //   return product.price;
  // }

  isProductAvailable(product: Product): boolean {
    return product.stock > 0 && !product.isDeleted;
  }

  

  // // ==================== ADVANCED SEARCH METHOD ====================

  // advancedProductSearch(filters: {
  //   title?: string;
  //   minPrice?: number;
  //   maxPrice?: number;
  //   minRating?: number;
  //   categoryId?: number;
  //   brandId?: number;
  // }): Observable<Product[]> {
  //   // This is a client-side implementation that combines multiple search criteria
  //   // You might want to implement this on the backend for better performance
  //   return this.getAllProducts().pipe(
  //     map(products => {
  //       return products.filter(product => {
  //         let matches = true;

  //         if (filters.title && !product.title.toLowerCase().includes(filters.title.toLowerCase())) {
  //           matches = false;
  //         }

  //         if (filters.minPrice && product.price < filters.minPrice) {
  //           matches = false;
  //         }

  //         if (filters.maxPrice && product.price > filters.maxPrice) {
  //           matches = false;
  //         }

  //         if (filters.minRating && product.rating < filters.minRating) {
  //           matches = false;
  //         }

  //         if (filters.categoryId && product.categoryId !== filters.categoryId) {
  //           matches = false;
  //         }

  //         if (filters.brandId && product.brandId !== filters.brandId) {
  //           matches = false;
  //         }

  //         return matches;
  //       });
  //     })
  //   );
  // }
}
