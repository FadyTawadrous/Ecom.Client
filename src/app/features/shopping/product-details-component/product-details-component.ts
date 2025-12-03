import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../core/models/product.models';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material-module';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details-component.html',
  styleUrls: ['./product-details-component.scss'],
  standalone: false
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = false;
  error: string | null = null;
  selectedImageIndex = 0;
  quantity = 1;
  private failedImages = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  goBackToShopping(): void {
    this.router.navigate(['/shopping']);
  }

  loadProduct(): void {
    this.isLoading = true;
    this.error = null;
    
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!productId) {
      this.error = 'Product not found';
      this.isLoading = false;
      return;
    }
    
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product. Please try again.';
        this.isLoading = false;
        console.error('Error loading product:', err);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getAllImages(): string[] {
    if (!this.product) return ['assets/default-product.jpg'];
    return this.productService.getAllValidProductImages(this.product);
  }

  isValidImageUrl(url: string): boolean {
    return this.productService.isValidImageUrl(url);
  }

  getSelectedImage(): string {
    const images = this.getAllImages();
    return images[this.selectedImageIndex];
  }

  onImageError(): void {
    this.failedImages.add(this.selectedImageIndex);
  }

  onThumbnailError(index: number): void {
    this.failedImages.add(index);
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // UPDATED: Add to cart with product ID and quantity parameters
  addToCart(): void {
    if (!this.product) return;
    
    // Get the product ID and quantity
    const productId = this.product.id;
    const quantity = this.quantity;
    
    // TODO: Implement cart service - use these parameters:
    // cartService.addToCart(productId, quantity);
    
    console.log('Add to cart - Product ID:', productId, 'Quantity:', quantity);
    
    // Show success message
    alert(`Added ${quantity} ${this.product.title}(s) to cart!`);
  }

  // NEW: Add to wishlist with product ID parameter
  addToWishlist(): void {
    if (!this.product) return;
    
    // Get the product ID
    const productId = this.product.id;
    
    // TODO: Implement wishlist service - use this parameter:
    // wishlistService.addToWishlist(productId);
    
    console.log('Add to wishlist - Product ID:', productId);
    
    // Show success message
    alert(`Added ${this.product.title} to your wishlist!`);
  }

  isInStock(): boolean {
    return this.product ? this.product.stock > 0 : false;
  }

  getFinalPrice(): number {
    if (!this.product) return 0;
    
    if (this.product.discountPercentage > 0) {
      const discount = this.product.price * (this.product.discountPercentage / 100);
      return this.product.price - discount;
    }
    
    return this.product.price;
  }
}