import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistItem } from '../../../core/models/wishlist.models';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-wishlist-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-item.html',
  styleUrls: ['./wishlist-item.scss']
})
export class WishlistItemComponent {
  @Input() item!: WishlistItem;
  @Output() remove = new EventEmitter<number>();
  private cartService = inject(CartService);
  
  onRemove() {
    this.remove.emit(this.item.id);
  }

  // Neeed to be Revised
  // If item exists → show quantity controls
  cartItem = computed(() =>
    this.cartService.cart()?.cartItems?.find(i => i.productId === this.item.productId)
  );

  addToCart() {
    this.cartService.addToCart(this.item.productId).subscribe();
  }

  increment() {
    if (!this.cartItem()) return;
    this.cartService.updateQuantity(this.cartItem()!.id, this.cartItem()!.quantity + 1).subscribe();
  }

  decrement() {
    if (!this.cartItem()) return;

    const current = this.cartItem()!;
    const newQty = current.quantity - 1;

    if (newQty <= 0) {
      this.cartService.removeItem(current.id).subscribe();
    } else {
      this.cartService.updateQuantity(current.id, newQty).subscribe();
    }
  }
}
