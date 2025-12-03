import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api-service';
import { Cart, CartItem } from '../models/cart.models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private api = inject(ApiService);

  // --- STATE SIGNALS ---
  private cartSignal = signal<Cart | null>(null);

  // Read-only signals
  readonly cart = this.cartSignal.asReadonly();
  readonly totalItems = computed(() => 
    this.cartSignal()?.cartItems?.reduce((acc, item) => acc + item.quantity, 0) ?? 0
  );
  readonly totalAmount = computed(() =>
    this.cartSignal()?.cartItems?.reduce((acc, item) => acc + item.totalPrice, 0) ?? 0
  );

  // --- API METHODS ---

  // Fetch cart from backend
  loadCart(): Observable<Cart> {
    return this.api.get<Cart>('cart').pipe(
      tap(cart => this.cartSignal.set(cart))
    );
  }

  // Add a product to cart
  addToCart(productId: number, quantity = 1): Observable<CartItem> {
    return this.api.post<CartItem>('api/Cart', { productId, quantity }).pipe(
      tap(item => {
        // Update signal locally
        const currentCart = this.cartSignal() ?? {
            id: 0,
            totalAmount: 0,
            appUserId: '',
            cartItems: [],
            createdOn: new Date().toISOString()
            };
        const existingItem = currentCart.cartItems?.find(i => i.productId === item.productId);
        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.totalPrice += item.totalPrice;
        } else {
          currentCart.cartItems?.push(item);
        }
        this.cartSignal.set(currentCart);
      })
    );
  }

  // Remove item from cart
  removeItem(cartItemId: number): Observable<void> {
    return this.api.delete<void>(`cart/items/${cartItemId}`).pipe(
      tap(() => {
        const updatedCart = this.cartSignal();
        if (updatedCart?.cartItems) {
          updatedCart.cartItems = updatedCart.cartItems.filter(i => i.id !== cartItemId);
          this.cartSignal.set(updatedCart);
        }
      })
    );
  }

  // Update quantity
  updateQuantity(cartItemId: number, quantity: number): Observable<CartItem> {
    return this.api.put<CartItem>(`cart/items/${cartItemId}`, { quantity }).pipe(
      tap(updatedItem => {
        const currentCart = this.cartSignal();
        if (currentCart?.cartItems) {
          const item = currentCart.cartItems.find(i => i.id === cartItemId);
          if (item) {
            item.quantity = updatedItem.quantity;
            item.totalPrice = updatedItem.totalPrice;
            this.cartSignal.set(currentCart);
          }
        }
      })
    );
  }

  // Clear the entire cart
  clearCart(): void {
        this.cartSignal.set({
            id: 0,
            totalAmount: 0,
            appUserId: '',    // can also use current user id if you have it
            cartItems: [],
            createdOn: new Date().toISOString(), // required field
            createdBy: undefined // optional
        });
    }   
}
