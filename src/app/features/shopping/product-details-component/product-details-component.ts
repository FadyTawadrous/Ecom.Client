import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // ← ADD Router
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../core/models/Product.models';
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
    private router: Router // ← ADD THIS
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  // NEW METHOD: Navigate back to shopping
  goBackToShopping(): void {
    // Navigate back to the shopping page
    this.router.navigate(['/shopping']);
    // OR if you want to go back to the previous page:
    // this.router.navigate(['..'], { relativeTo: this.route });
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

  addToCart(): void {
    if (!this.product) return;
    
    // TODO: Implement cart service
    console.log('Add to cart:', this.product, 'Quantity:', this.quantity);
    
    // Show success message
    alert(`Added ${this.quantity} ${this.product.title}(s) to cart!`);
  }

  // REMOVE the buyNow() method completely
  // buyNow(): void {
  //   if (!this.product) return;
  //   this.addToCart();
  //   console.log('Buy now clicked');
  // }

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