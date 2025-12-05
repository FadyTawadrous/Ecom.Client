import { Injectable, signal, computed, inject } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api-service';
import { GetCartDTO, GetCartItemDTO, AddCartItemDTO } from '../models/cart.models';
import { AuthService } from './auth-service';
import { switchMap } from 'rxjs/operators';

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
            // this.createCart();
          }
        },
        // error: () => this.createCart()
      });
  }

  


  // ------------------------------
  // ADD ITEM TO CART
  // ------------------------------
  addToCart(productId: number, quantity = 1, unitPrice: number) : any {
  const user = this.auth.currentUser();
  if (!user) {
    throw new Error("User not logged in.");
  }

  let cart = this.cartSignal();

  // 1️⃣ If cart not loaded → load it and retry ONCE
  if (!cart) {
    console.log("Cart not loaded → fetching from backend...");

    return this.api.get<{ result: GetCartDTO, isSuccess: boolean }>('api/cart/user')
      .pipe(
        tap(res => {
          if (res.isSuccess) {
            const loadedCart = res.result;

            // Recalculate totalPrice
            loadedCart.cartItems = loadedCart.cartItems.map(item => ({
              ...item,
              totalPrice: item.unitPrice * item.quantity
            }));

            loadedCart.totalAmount = loadedCart.cartItems.reduce(
              (sum, item) => sum + item.totalPrice,
              0
            );
            this.refreshTotals();
            this.cartSignal.set(loadedCart);
            console.log("Cart loaded successfully");
          } else {
            throw new Error("Cart does not exist in backend.");
          }
        }),
        switchMap(() => {
          // retry addToCart AFTER loading cart
          return this.addToCart(productId, quantity, unitPrice);
        })
      );
  }

  // 2️⃣ Cart already exists → add item normally
  const dto = {
    cartId: cart.id,
    productId,
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
    createdBy: user.id
  };

  return this.api.post<{ result: GetCartItemDTO, isSuccess: boolean }>('api/cartitem', dto)
    .pipe(
      tap(res => {
        if (!res.isSuccess || !res.result) return;

        const addedItem = res.result;
        const current = this.cartSignal();
        if (!current) return;

        // Update UI cart
        const existing = current.cartItems.find(i => i.productId === addedItem.productId);

        if (existing) {
          existing.quantity += addedItem.quantity;
          existing.totalPrice += addedItem.totalPrice;
        } else {
          current.cartItems.push(addedItem);
        }

        current.totalAmount = current.cartItems.reduce(
          (sum, i) => sum + i.totalPrice, 0
        );
            this.refreshTotals();

        this.cartSignal.set({ ...current });
      })
    );
}





  // ------------------------------
  // UPDATE QUANTITY
  // ------------------------------
  updateQuantity(cartItemId: number, quantity: number):any {
  const cart = this.cartSignal();
  if (!cart) return;

  const item = cart.cartItems.find(i => i.id === cartItemId);
  if (!item) return;

  const dto = {
    id: cartItemId,
    quantity: quantity,
    unitPrice: item.unitPrice,
    cartId: item.cartId,
    productId: item.productId,
    updatedBy: this.auth.currentUser()?.id || ""
  };

  return this.api.put<{ result: GetCartItemDTO, isSuccess: boolean }>('api/CartItem', dto)
    .pipe(
      tap((res) => {
        if (!res?.isSuccess || !res.result) return;

        // update item
        item.quantity = res.result.quantity;

        // FIX: recalculating totalPrice here
        item.totalPrice = item.unitPrice * item.quantity;

        // important: refresh totals
        this.refreshTotals();
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
  clearCart():any {
  const cart = this.cartSignal();

  // 1️⃣ If no cart loaded → load it first then retry
  if (!cart) {
    console.warn("Cart not loaded — loading then clearing...");

    return this.api.get<{ result: GetCartDTO, isSuccess: boolean }>('api/cart/user')
      .pipe(
        tap(res => {
          if (res.isSuccess) {
            this.cartSignal.set(res.result);
          }
        }),
        switchMap(() => this.clearCart()) // retry AFTER loading
      );
  }

  // 2️⃣ Cart exists → clear backend cart
  return this.api.delete('api/cart/clear/' + cart.id).pipe(
    tap(() => {
      this.cartSignal.set({
        id: cart.id,
        appUserId: cart.appUserId,
        cartItems: [],
        totalAmount: 0,
        createdOn: cart.createdOn
      });
      console.log("Cart successfully cleared.");
    })
  );
}

private refreshTotals() {
  const cart = this.cartSignal();
  if (!cart) return;

  cart.cartItems = cart.cartItems.map(item => ({
    ...item,
    totalPrice: item.unitPrice * item.quantity   // ← ALWAYS RECALCULATE
  }));

  cart.totalAmount = cart.cartItems.reduce(
    (sum, i) => sum + i.totalPrice, 0
  );

  this.cartSignal.set({ ...cart });
}

}
