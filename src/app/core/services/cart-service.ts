import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { ApiService } from './api-service';
import { AuthService } from './auth-service';
import { GetCartDTO, GetCartItemDTO } from '../models/cart.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private api = inject(ApiService);
  private auth = inject(AuthService);

  // ------------------------------
  // STATE
  // ------------------------------
  private cartSignal = signal<GetCartDTO | null>(null);
  readonly cart = this.cartSignal.asReadonly();

  // Badge: total number of units in cart
  readonly totalItems = computed(() => {
    const cart = this.cartSignal();
    if (!cart || !cart.cartItems) return 0;

    return cart.cartItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0
    );
  });

  // Total amount (from items)
  readonly totalAmount = computed(() => {
    const cart = this.cartSignal();
    if (!cart || !cart.cartItems) return 0;

    return cart.cartItems.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );
  });

  // ------------------------------
  // HELPERS
  // ------------------------------

  /** Normalize numbers & update the cart signal */
  private setCartFromDto(dto: GetCartDTO | null) {
    if (!dto) {
      this.cartSignal.set(null);
      return;
    }

    const cleanItems = dto.cartItems.map(item => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;

      return {
        ...item,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity
      };
    });

    const totalAmount = cleanItems.reduce(
      (sum, i) => sum + i.totalPrice,
      0
    );

    const cleanCart: GetCartDTO = {
      ...dto,
      cartItems: cleanItems,
      totalAmount
    };

    this.cartSignal.set(cleanCart);
  }

  /** Ensure user is logged in and return userId or error */
  private requireUserId(): string {
    const user = this.auth.currentUser();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return user.id;
  }

  // ------------------------------
  // LOAD CART (CALL THIS ON LOGIN / APP INIT)
  // ------------------------------
  loadCart(): void {
    this.api.get<{ result: GetCartDTO; isSuccess: boolean }>('api/cart/user')
      .subscribe({
        next: res => {
          if (res.isSuccess && res.result) {
            this.setCartFromDto(res.result);
          } else {
            this.cartSignal.set(null);
          }
        },
        error: err => {
          console.error('Failed to load cart:', err);
          this.cartSignal.set(null);
        }
      });
  }

  // ------------------------------
  // ADD ITEM TO CART
  // ------------------------------
  addToCart(productId: number, quantity = 1, unitPrice: number): Observable<any> {
    const userId = this.requireUserId();

    const currentCart = this.cartSignal();

    // If cart not yet loaded, load it first then retry
    if (!currentCart) {
      return this.api
        .get<{ result: GetCartDTO; isSuccess: boolean }>('api/cart/user')
        .pipe(
          tap(res => {
            if (!res.isSuccess || !res.result) {
              throw new Error('Cart not found for this user.');
            }
            this.setCartFromDto(res.result);
          }),
          switchMap(() => this.addToCart(productId, quantity, unitPrice))
        );
    }

    const dto = {
      cartId: currentCart.id,
      productId,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalPrice: Number(unitPrice) * Number(quantity),
      createdBy: userId
    };

    return this.api
      .post<{ result: GetCartItemDTO; isSuccess: boolean }>('api/cartitem', dto)
      .pipe(
        tap(res => {
          if (!res.isSuccess) {
            console.error('Backend refused addToCart:', res);
            return;
          }
          // 🔁 Reload full cart from backend to stay in sync
          this.loadCart();
        })
      );
  }

  // ------------------------------
  // UPDATE QUANTITY (INCREMENT / DECREMENT)
  // ------------------------------
  updateQuantity(cartItemId: number, quantity: number): Observable<any> {
    const cart = this.cartSignal();
    if (!cart) {
      return throwError(() => new Error('Cart not loaded'));
    }

    const item = cart.cartItems.find(i => i.id === cartItemId);
    if (!item) {
      return throwError(() => new Error('Cart item not found'));
    }

    const dto = {
      id: cartItemId,
      quantity: Number(quantity),
      unitPrice: Number(item.unitPrice),
      cartId: item.cartId,
      productId: item.productId,
      updatedBy: this.auth.currentUser()?.id || ''
    };

    return this.api
      .put<{ result: GetCartItemDTO; isSuccess: boolean }>('api/CartItem', dto)
      .pipe(
        tap(res => {
          if (!res.isSuccess) {
            console.error('Backend refused updateQuantity:', res);
            return;
          }
          // 🔁 Sync from backend
          this.loadCart();
        })
      );
  }

  // ------------------------------
  // REMOVE ITEM
  // ------------------------------
  removeItem(cartItemId: number): Observable<any> {
    return this.api
      .delete('api/cartitem/' + cartItemId)
      .pipe(
        tap(() => {
          // 🔁 Reload cart from backend after deletion
          this.loadCart();
        })
      );
  }

  // ------------------------------
  // CLEAR CART
  // ------------------------------
  clearCart(): Observable<any> {
    const cart = this.cartSignal();
    if (!cart) {
      return throwError(() => new Error('Cart not loaded'));
    }

    return this.api
      .delete('api/cart/clear/' + cart.id)
      .pipe(
        tap(() => {
          // Local clean state
          this.cartSignal.set({
            id: cart.id,
            appUserId: cart.appUserId,
            cartItems: [],
            totalAmount: 0,
            createdOn: cart.createdOn
          });
        })
      );
  }
}
