import { Injectable, signal, computed, inject } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api-service';
import { GetCartDTO, GetCartItemDTO, AddCartItemDTO } from '../models/cart.models';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private api = inject(ApiService);
  private auth = inject(AuthService);

  // ------------------------------
  // CART STATE (signals)
  // ------------------------------
  private cartSignal = signal<GetCartDTO | null>(null);

  readonly cart = this.cartSignal.asReadonly();
  readonly totalItems = computed(() =>
    this.cartSignal()?.cartItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0
  );
  readonly totalAmount = computed(() =>
    this.cartSignal()?.cartItems?.reduce((sum, i) => sum + i.totalPrice, 0) ?? 0
  );

  // ------------------------------
  // LOAD CART
  // ------------------------------
  loadCart(): void {
    this.api.get<{ result: GetCartDTO, isSuccess: boolean }>('api/cart/user')
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            const cart = res.result;

            // Recalculate totalPrice for each item
            cart.cartItems = cart.cartItems.map(item => ({
              ...item,
              totalPrice: item.unitPrice * item.quantity
            }));

            // Update totalAmount
            cart.totalAmount = cart.cartItems.reduce((sum, i) => sum + i.totalPrice, 0);

            this.cartSignal.set(cart);

          } else {
            this.createCart();
          }
        },
        error: () => this.createCart()
      });
  }

  // ------------------------------
  // CREATE CART
  // ------------------------------
  private createCart(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    const dto = {
      appUserId: user.id,
      createdBy: user.id
    };

    this.api.post<{ result: GetCartDTO, isSuccess: boolean }>('api/cart', dto)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cartSignal.set(res.result);
          }
        },
        error: (err) => console.error("Failed to create cart:", err)
      });
  }


  // ------------------------------
  // ADD ITEM TO CART
  // ------------------------------
  addToCart(productId: number, quantity = 1, unitPrice: number): any {
    const user = this.auth.currentUser();
    const cart = this.cartSignal();

    if (!user) throw new Error("User not logged in.");

    if (!cart) {
      this.createCart();
      return this.addToCart(productId, quantity, unitPrice);
    }

    const dto = {
      cartId: cart.id,
      productId,
      quantity,
      unitPrice,   // SEND REAL PRICE
      totalPrice:unitPrice*quantity,
      createdBy: user.id
    };

    return this.api.post<{ result: GetCartItemDTO, isSuccess: boolean }>('api/cartitem', dto)
      .pipe(
        tap(res => {
          if (!res.isSuccess || !res.result) return;

          const addedItem = res.result;
          const current = this.cartSignal();
          if (!current) return;

          // Update or add new item
          const existing = current.cartItems.find(i => i.productId === addedItem.productId);
          if (existing) {
            existing.quantity += addedItem.quantity;
            existing.unitPrice = addedItem.unitPrice;      // update unitPrice too
            existing.totalPrice += addedItem.totalPrice;
          } else {
            current.cartItems.push(addedItem);
          }

          this.cartSignal.set({ ...current });
        })
      );
  }




  // ------------------------------
  // UPDATE QUANTITY
  // ------------------------------
  updateQuantity(cartItemId: number, quantity: number) {
    const dto = { id: cartItemId, quantity };

    return this.api.put<{ result: GetCartItemDTO, isSuccess: boolean }>('api/CartItem', dto)
      .pipe(
        tap((res) => {
          if (!res?.result) return;

          const c = this.cartSignal();
          if (!c) return;

          const item = c.cartItems.find(i => i.id === cartItemId);
          if (!item) return;

          item.quantity = res.result.quantity;
          item.totalPrice = res.result.totalPrice;

          this.cartSignal.set({ ...c });
        })
      );
  }


  // ------------------------------
  // DELETE ITEM
  // ------------------------------
  removeItem(cartItemId: number) {
    return this.api.delete('api/cartitem/' + cartItemId)
      .pipe(
        tap(() => {
          const c = this.cartSignal();
          if (!c) return;

          c.cartItems = c.cartItems.filter(i => i.id !== cartItemId);
          this.cartSignal.set({ ...c });
        })
      );
  }


  // ------------------------------
  // CLEAR CART
  // ------------------------------
  clearCart() {
    const cart = this.cartSignal();
    if (!cart) return;

    return this.api.delete('api/cart/clear/' + cart.id)
      .pipe(
        tap(() => {
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
