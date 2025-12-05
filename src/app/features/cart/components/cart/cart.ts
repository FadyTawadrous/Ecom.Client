import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CartService } from '../../../../core/services/cart-service';
import { UiService } from '../../../../core/services/ui-service';
import { PaymentStateService } from '../../../../core/services/payment-state-service';
import { ProductService } from '../../../../core/services/product-service';

import { GetCartItemDTO } from '../../../../core/models/cart.models';
import { MaterialModule } from '../../../../shared/material/material-module';
import { SharedModule } from '../../../../shared/shared-module';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [
    CommonModule,
    CurrencyPipe,
    MaterialModule,
    SharedModule,
    MatDialogModule,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {

  // ------------------------------
  // Services
  // ------------------------------
  private cartService = inject(CartService);
  private router = inject(Router);
  private ui = inject(UiService);
  private dialog = inject(MatDialog);
  private paymentState = inject(PaymentStateService);
  private productService = inject(ProductService);

  // ------------------------------
  // Signals from CartService
  // ------------------------------
  cart = this.cartService.cart;
  total = this.cartService.totalAmount;
  cartItems = computed(() => this.cart()?.cartItems ?? []);
  loading = computed(() => !this.cart());

  // ------------------------------
  // Product cache (name + thumbnail)
  // ------------------------------
  private productCache: Record<
    number,
    { name: string; image: string; loaded: boolean }
  > = {};

  ngOnInit() {
    this.cartService.loadCart();
    // ❗ No effect(), no extra logic needed here
  }

  // ------------------------------
  // Ensure product info is loaded (name + image)
  // ------------------------------
  private ensureProductInfo(productId: number): void {
    // Already loaded → do nothing
    const cached = this.productCache[productId];
    if (cached?.loaded) return;

    // If request already in flight, we don't block, just return
    if (cached && !cached.loaded) return;

    // Mark as loading with safe defaults
    this.productCache[productId] = {
      name: '',
      image: 'assets/default-product.jpg',
      loaded: false
    };

    this.productService.getProductById(productId).subscribe({
      next: product => {
        this.productCache[productId] = {
          name: product.title,
          image: this.productService.getThumbnailUrl(product),
          loaded: true
        };
      },
      error: () => {
        // On error, keep default image and empty name
        this.productCache[productId] = {
          name: '',
          image: 'assets/default-product.jpg',
          loaded: true
        };
      }
    });
  }

  // ------------------------------
  // PRODUCT NAME (used in template)
  // ------------------------------
  getProductName(item: GetCartItemDTO): string {
    const productId = item.productId;

    const cached = this.productCache[productId];
    if (!cached) {
      // Trigger lazy load
      this.ensureProductInfo(productId);
      return 'Loading...';
    }

    // Once loaded, return name (or a fallback)
    return cached.name || 'Unnamed product';
  }

  // ------------------------------
  // PRODUCT IMAGE (used in template)
  // ------------------------------
  getProductImage(item: GetCartItemDTO): string {
    const productId = item.productId;

    const cached = this.productCache[productId];
    if (!cached) {
      // Trigger lazy load and return default for first render
      this.ensureProductInfo(productId);
      return 'assets/default-product.jpg';
    }

    return cached.image || 'assets/default-product.jpg';
  }

  // ------------------------------
  // QUANTITY
  // ------------------------------
  increment(item: GetCartItemDTO) {
    this.cartService.updateQuantity(item.id, item.quantity + 1).subscribe({
      error: () => this.ui.error("Failed to update quantity")
    });
  }

  decrement(item: GetCartItemDTO) {
    const newQty = item.quantity - 1;

    if (newQty <= 0) {
      this.removeItem(item.id);
    } else {
      this.cartService.updateQuantity(item.id, newQty).subscribe({
        error: () => this.ui.error("Failed to update quantity")
      });
    }
  }

  // ------------------------------
  // REMOVE ITEM
  // ------------------------------
  removeItem(itemId: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Remove Item',
        message: 'Are you sure you want to remove this item from your cart?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.cartService.removeItem(itemId).subscribe({
        next: () => this.ui.success('Item removed'),
        error: () => this.ui.error('Failed to remove item')
      });
    });
  }

  // ------------------------------
  // CLEAR CART
  // ------------------------------
  clearCart() {
    this.cartService.clearCart().subscribe({
      error: () => this.ui.error("Failed to clear cart")
    });
  }

  // ------------------------------
  // PAYMENT
  // ------------------------------
  goToPayment() {
    this.paymentState.setTotal(this.total());
    this.router.navigate(['/payment']);
  }
}
