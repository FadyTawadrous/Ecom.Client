import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../core/models/product.models';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material-module';
import { CartService } from '../../../core/services/cart-service';
import { WishlistService } from '../../../core/services/wishlist-service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details-component.html',
  styleUrls: ['./product-details-component.scss'],
  standalone: false
})
export class ProductDetailsComponent implements OnInit {
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  private toast = inject(ToastService);

  product: Product | null = null;
  isLoading = false;
  error: string | null = null;
  selectedImageIndex = 0;
  quantity = 1;
  private failedImages = new Set<number>();
  
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    console.log(this.authService.isAuthenticated());
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated. Cannot add to cart.');
      this.toast.warn('Please log in to add items to your cart!');
      return;
    }

    if (!this.product) return;

    console.log('Add to cart:', this.product, 'Quantity:', this.quantity);

    this.cartService.addToCart(this.product.id, this.quantity, this.getFinalPrice()).subscribe({
      next: () => {
        // Use Toast service with the dynamic message
        this.toast.success(`Added ${this.quantity} ${this.product!.title}(s) to cart!`);
      },
      error: () => {
        this.toast.error('Failed to add item to cart.');
      }
    });
  }

  isInWishlist(): boolean {
    if (!this.product) return false;
    return this.wishlistService.wishlist().some(i => i.productId === this.product!.id);
  }

  // Toggle wishlist (Add or Remove)
  toggleWishlist(): void {
    if (!this.authService.isAuthenticated()) {
      this.toast.warn('Please log in to manage your wishlist!');
      return;
    }

    if (!this.product) return;

    this.wishlistService.toggleWishlist(this.product.id).subscribe({
      next: (result) => {
        // If result is object (WishlistItem), it was added. If void/undefined, it was removed.
        // Or strictly rely on the isInWishlist() check after the operation if signals update reactively.
        
        if (result) {
          this.toast.success('Added to wishlist!');
        } else {
          // If the service returns void for remove, we assume removal.
          // Adjust message logic based on exact service return type if needed.
          this.toast.info('Removed from wishlist');
        }
        // Refresh wishlist signal
        this.wishlistService.loadWishlist(1, this.wishlistService.totalItems()).subscribe(); 
      },
      error: (err) => {
        console.error("Wishlist toggle error:", err);
        this.toast.error('Failed to update wishlist');
      }
    });
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