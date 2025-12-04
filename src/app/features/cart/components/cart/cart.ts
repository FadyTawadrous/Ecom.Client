import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../../../core/services/api-service';
import {UiService} from '../../../../core/services/ui-service';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Router } from '@angular/router';
import { PaymentStateService } from '../../../../core/services/payment-state-service';

import {
  GetCartDTO,
  GetCartItemDTO,
  UpdateCartItemDTO
} from '../../../../core/models/cart.models';
import { MaterialModule } from '../../../../shared/material/material-module';
import { SharedModule } from '../../../../shared/shared-module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth-service';
@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [
    CommonModule,
    CurrencyPipe,
    MaterialModule,
    SharedModule,
MatDialogModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {

  /** Signals */
  cart = signal<GetCartDTO | null>(null);
  cartItems = signal<GetCartItemDTO[]>([]);
  loading = signal<boolean>(false);

  private api = inject(ApiService);
  private router = inject(Router);
  private paymentState = inject(PaymentStateService);
  private dialog = inject(MatDialog);
  private ui = inject(UiService);
  private auth = inject(AuthService);
  // userId = '081d0d65-8f7b-4375-afd2-81cf2664fe6e';

  ngOnInit() {
    this.loadCart();
  }

  /** Load Cart */
  loadCart() {
    this.loading.set(true);

    this.api
      .get<{ result: GetCartDTO; isSuccess: boolean }>(`api/cart/user/`)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cart.set(res.result);
            this.loadCartItems(res.result.id);
          } else {
            this.loading.set(false);
          }
        },
        error: () => this.loading.set(false)
      });
  }

  /** Load Cart Items */
  loadCartItems(cartId: number) {
    this.api
      .get<{ result: GetCartItemDTO[]; isSuccess: boolean }>(`api/cartitem/cart/${cartId}`)
      .subscribe({
        next: (res) => {
          const items = Array.isArray(res.result) ? res.result : [];
          this.cartItems.set(items);
          this.loading.set(false);
        },
        error: () => {
          this.cartItems.set([]);
          this.loading.set(false);
        }
      });
  }

  /** Update Quantity */
  updateQuantity(item: GetCartItemDTO, qty: number) {
    const userId= this.auth.currentUser()?.id;
    
  if (qty < 1) return;

  const dto: UpdateCartItemDTO = {
    id: item.id,
    quantity: qty,
    unitPrice: item.unitPrice,
    cartId: item.cartId,
    productId: item.productId,
    updatedBy:userId ? userId : ''
  };
  console.log(dto)
  this.api
    .put<{ isSuccess: boolean }>('api/CartItem', dto)
    .subscribe({
      next: () => this.loadCart(),
      error: err => console.error("updateQuantity FAILED:", err)
    });
}


  /** Remove item */
  removeItem(itemId: number) {
  const dialogRef = this.dialog.open(ConfirmDialog, {
    data: {
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?'
    }
  });

  dialogRef.afterClosed().subscribe(confirmed => {
    if (!confirmed) return;

    this.api
      .delete<{ isSuccess: boolean }>(`api/cartitem/${itemId}`)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.ui.success('Item removed from cart');
            this.loadCart();
          } else {
            this.ui.error('Failed to remove item');
          }
        },
        error: () => {
          this.ui.error('Server error while removing item');
        }
      });
  });
}


  /** Clear Cart */
  clearCart() {
    const cartId = this.cart()?.id;
    if (!cartId) return;

    this.api.delete(`api/cart/clear/${cartId}`).subscribe(() => {
      this.loadCart();
    });
  }

  /** Total using computed signal (cleaner & reactive) */
  total = computed(() => {
    const items = this.cartItems();
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, i) => sum + i.totalPrice, 0);
  });

  goToPayment() {
   const total = this.total; // your computed getter
  this.paymentState.setTotal(total());

  this.router.navigate(['/payment']);
}
}
