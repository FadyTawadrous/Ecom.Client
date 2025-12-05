// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { Product } from '../../../core/models/Product.models';
// import { ProductService } from '../../../core/services/product-service';


// @Component({
//   selector: 'app-product-card',
//   templateUrl: './product-card.component.html',
//   styleUrls: ['./product-card.component.scss'],
//   standalone: false,

// })
// export class ProductCardComponent {

//   constructor(private productService: ProductService) {}

// getThumbnail(product: Product): string {


  
//   return this.productService.getProductImageUrl(product.thumbnailUrl,true);
// }
//   // INPUT: Data comes from parent (ProductListComponent)
//   @Input() product!: Product;
  
//   // OUTPUT: Events sent to parent when user clicks buttons
//   @Output() addToCart = new EventEmitter<Product>();
//   @Output() addToWishlist = new EventEmitter<Product>();
  
//   // Handle add to cart button click
//   onAddToCart(): void {
//     this.addToCart.emit(this.product);
//   }
  
//   // Handle add to wishlist button click
//   onAddToWishlist(): void {
//     this.addToWishlist.emit(this.product);
//   }
// }


// product-card.component.ts - UPDATED
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router'; // ← ADD THIS IMPORT
import { Product } from '../../../core/models/product.models';
import { ProductService } from '../../../core/services/product-service';
import { CartService } from '../../../core/services/cart-service';
import { WishlistService } from '../../../core/services/wishlist-service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: false,
})
export class ProductCardComponent {
  private wishlistService = inject(WishlistService);
  // Add Router to constructor
  constructor(
    private productService: ProductService,
    private router: Router // ← ADD THIS
  ) {}

  getThumbnail(product: Product): string {
    return this.productService.getProductImageUrl(product.thumbnailUrl, true);
  }
  
@Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  
  // NEW METHOD: Navigate to product details
  navigateToProductDetails(): void {
    console.log(this.product.id);
    
    // this.router.navigate(['/product', this.product.id]);
    // OR if you have a different route:
    // this.router.navigate(['/products', this.product.id]);
    this.router.navigate(['/shopping/product', this.product.id]);
  }
  
  onAddToCart(): void {
    console.log(this.product.id);
    this.addToCart.emit(this.product);  
  }
  
  onToggleWishlist(): void {
    console.log(this.product.id);
    this.addToWishlist.emit(this.product);
  }

  isInWishlist(): boolean {
    if (!this.product) return false;
    return this.wishlistService.wishlist().some(i => i.productId === this.product!.id);
  }
}