import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/Product.models';
import { MaterialModule } from '../../../shared/material/material-module';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [MaterialModule, CurrencyPipe]
})
export class ProductCardComponent {
  // INPUT: Data comes from parent (ProductListComponent)
  @Input() product!: Product;
  
  // OUTPUT: Events sent to parent when user clicks buttons
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  
  // Handle add to cart button click
  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
  
  // Handle add to wishlist button click
  onAddToWishlist(): void {
    this.addToWishlist.emit(this.product);
  }
}