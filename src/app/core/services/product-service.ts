import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';  // ← ADD THIS IMPORT
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
} from '../models/product.models';
import { environment } from '../../../environments/environment';

// Helper interface for API response
interface ApiResponse<T> {
  result: T;
  errorMessage: string | null;
  isSuccess: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService = inject(ApiService);

  // Helper method to extract data from API response
  private extractData<T>(response: ApiResponse<T>): T {
    if (response.isSuccess && response.result !== null && response.result !== undefined) {
      return response.result;
    } else {
      throw new Error(response.errorMessage || 'API request failed');
    }
  }

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

    return this.apiService.get<ApiResponse<Product[]>>('api/Product/all', params).pipe(
      map(response => this.extractData(response))
    );
  }


  filterProducts(filters: any) {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ProductFilter];
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }
    
  return this.apiService.get<ApiResponse<Product[]>>(`api/Product/filter`, params).pipe(
   map(response => this.extractData(response))
    );
}



  getProductById(id: number): Observable<Product> {
    return this.apiService.get<ApiResponse<Product>>(`api/Product/${id}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.apiService.get<ApiResponse<Product[]>>(`api/Product/brand/${brandId}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.apiService.get<ApiResponse<Product[]>>(`api/Product/category/${categoryId}`).pipe(
      map(response => this.extractData(response))
    );
  }

  searchProductsByTitle(title: string): Observable<Product[]> {
    const params = new HttpParams().set('title', title);
    console.log("search by title");
    
    return this.apiService.get<ApiResponse<Product[]>>('api/Product/search/title', params).pipe(
      map(response => this.extractData(response))
    );
    
    
  }

 searchProductsByPrice(minPrice?: number, maxPrice?: number): Observable<Product[]> {
  let params = new HttpParams();

  console.log('price filter service');

  if (minPrice !== undefined) {
    params = params.set('min', minPrice.toString());   // FIXED
  }

  if (maxPrice !== undefined) {
    params = params.set('max', maxPrice.toString());   // FIXED
  }

  return this.apiService.get<ApiResponse<Product[]>>('api/Product/search/price', params).pipe(
    map(response => this.extractData(response))
  );
}


  searchProductsByRating(minRating: number): Observable<Product[]> {
    const params = new HttpParams().set('minRating', minRating.toString());
    return this.apiService.get<ApiResponse<Product[]>>('api/Product/search/rating', params).pipe(
      map(response => this.extractData(response))
    );
  }

  // ==================== PRODUCT IMAGE ENDPOINTS ====================

  getAllProductImages(): Observable<ProductImageUrl[]> {
    return this.apiService.get<ApiResponse<ProductImageUrl[]>>('api/ProductImageUrl').pipe(
      map(response => this.extractData(response))
    );
  }

  getProductImageById(id: number): Observable<ProductImageUrl> {
    return this.apiService.get<ApiResponse<ProductImageUrl>>(`api/ProductImageUrl/${id}`).pipe(
      map(response => this.extractData(response))
    );
  }

  // ==================== PRODUCT REVIEW ENDPOINTS ====================

  getAllReviews(): Observable<ProductReview[]> {
    return this.apiService.get<ApiResponse<ProductReview[]>>('api/ProductReview').pipe(
      map(response => this.extractData(response))
    );
  }

  getReviewsByProduct(productId: number): Observable<ProductReview[]> {
    return this.apiService.get<ApiResponse<ProductReview[]>>(`api/ProductReview/product/${productId}`).pipe(
      map(response => this.extractData(response))
      
      
    );
  }

  getUserReviews(): Observable<ProductReview[]> {
    return this.apiService.get<ApiResponse<ProductReview[]>>('api/ProductReview/user').pipe(
      map(response => this.extractData(response))
    );
  }

  getReviewsByBrand(brandId: number): Observable<ProductReview[]> {
    return this.apiService.get<ApiResponse<ProductReview[]>>(`api/ProductReview/brand/${brandId}`).pipe(
      map(response => this.extractData(response))
    );
  }

  getReviewById(id: number): Observable<ProductReview> {
    return this.apiService.get<ApiResponse<ProductReview>>(`api/ProductReview/${id}`).pipe(
      map(response => this.extractData(response))
    );
  }

  createReview(review: ProductReviewCreate): Observable<ProductReview> {
    console.log(review);
    
    return this.apiService.post<ApiResponse<ProductReview>>('api/ProductReview', review).pipe(
      map(response => this.extractData(response))
    );
  }

  updateReview(review: ProductReviewUpdate): Observable<ProductReview> {
    return this.apiService.put<ApiResponse<ProductReview>>(`api/ProductReview/`, review).pipe(
      map(response => this.extractData(response))
    );
  }

  deleteReview(reviewId: number): Observable<void> {
   
    
    return this.apiService.delete<ApiResponse<void>>(`api/ProductReview/toggle/${reviewId}`).pipe(
      map(response => {
        // For delete, we just check if successful
        if (!response.isSuccess) {
          throw new Error(response.errorMessage || 'undifind');
        }
      })
    );
  }

  // ==================== CATEGORY ENDPOINTS ====================

  getAllCategories(): Observable<Category[]> {
    return this.apiService.get<ApiResponse<Category[]>>('api/Category').pipe(
      map(response => this.extractData(response))
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.apiService.get<ApiResponse<Category>>(`api/Category/${id}`).pipe(
      map(response => this.extractData(response))
    );
  }

  // ==================== BRAND ENDPOINTS ====================

  getAllBrands(): Observable<Brand[]> {
    return this.apiService.get<Brand[]>('api/Brand');
      
      
   
  }

  getBrandById(id: number): Observable<Brand> {
    return this.apiService.get<Brand>(`api/Brand/${id}`)
    
  }

  // ==================== IMAGE HANDLING METHODS ====================

 // In product.service.ts - FIX THIS METHOD:
getProductImageUrl(imagePath: string | null, isThumbnail: boolean = false): string {
  if (!imagePath) {
    return 'assets/default-product.jpg'; // Local fallback
  }
  
  // 1. Check if it's an error message (from your API response)
  if (imagePath.includes('Could not find a part of the path')) {
    return 'assets/default-product.jpg';
  }
  
  // 2. If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
   if (isThumbnail) {
    // Thumbnails go to ProductThumbnail folder
    console.log(imagePath);
    
    return `https://localhost:7196/Files/Images/ProductThumbnail/${imagePath}`;
  } 
  else {
    // Product images go to ProductImages folder
    return `$https://localhost:7196/Files/Images/ProductImages/${imagePath}`;
  }
}

  getThumbnailUrl(product: Product): string {
     if (product.thumbnailUrl) {
    // ✅ Pass true for thumbnail
    return this.getProductImageUrl(product.thumbnailUrl, true);
  }
  
  // Fallback to first product image (not thumbnail)
  if (product.productImageUrls && product.productImageUrls.length > 0) {
    const firstImage = product.productImageUrls[0].imageUrl;
    return this.getProductImageUrl(firstImage, false);
  }
  
  return this.getProductImageUrl(null, false);
  }

  getProductGalleryImages(product: Product): string[] {
    if (!product.productImageUrls || product.productImageUrls.length === 0) {
    return [];
  }

  // ✅ Product images (not thumbnails)
  return product.productImageUrls.map(img => 
    this.getProductImageUrl(img.imageUrl, false)
  );
    }
  

  // Get all valid images including thumbnail
  getAllValidProductImages(product: Product ): string[] {
  const images: string[] = [];
  
  // Add thumbnail (with thumbnail path)
  if (product.thumbnailUrl && this.isValidImageUrl(product.thumbnailUrl)) {
    images.push(this.getProductImageUrl(product.thumbnailUrl, true));
  }
  
  // Add product images (with product images path)
  const galleryImages = this.getProductGalleryImages(product);
  images.push(...galleryImages);
  
  // Remove duplicates
  const uniqueImages = [...new Set(images)];
  
  // If no valid images, return default
  if (uniqueImages.length === 0) {
    return [this.getProductImageUrl(null, false)];
  }
  
  return uniqueImages;
}

  // Check if image URL is valid
 

  isValidImageUrl(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  // 1. Reject error messages
  if (imageUrl.includes('Could not find a part of the path')) {
    return false;
  }
  
  // 2. Accept if it's a file name with image extension
  const isFileNameWithExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imageUrl);
  
  // 3. Accept if it's any kind of URL
  const isHttpUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
  const isDataUrl = imageUrl.startsWith('data:image/');
  
  // 4. Accept if it's a relative path
  const isRelativePath = imageUrl.startsWith('/') || 
                         imageUrl.startsWith('./') || 
                         imageUrl.startsWith('../');
  
  return isFileNameWithExtension || isHttpUrl || isDataUrl || isRelativePath;
}

// 

  // ==================== UTILITY METHODS ====================

  calculateDiscountedPrice(price: number, discountPercentage: number): number {
    return price - (price * discountPercentage / 100);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  hasDiscount(product: Product): boolean {
    return product.discountPercentage > 0;
  }

  getFinalPrice(product: Product): number {
    if (this.hasDiscount(product)) {
      return this.calculateDiscountedPrice(product.price, product.discountPercentage);
    }
    return product.price;
  }

  isProductAvailable(product: Product): boolean {
    return product.stock > 0 && !product.isDeleted;
  }
}