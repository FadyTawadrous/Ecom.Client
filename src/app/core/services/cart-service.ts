import { Injectable, signal, computed, inject } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api-service';
import { GetCartDTO, GetCartItemDTO, AddCartItemDTO } from '../models/cart.models';
import { AuthService } from './auth-service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  private totalItemsSignal = signal<number>(0);

  // Use this in your Navbar component
  readonly totalItems = this.totalItemsSignal.asReadonly();
  readonly cart = this.cartSignal.asReadonly();

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
            this.cartSignal.set(cart);

            // Set the total items count based on the loaded data
            const totalQty = cart.cartItems.reduce((sum, i) => sum + i.quantity, 0);
            this.totalItemsSignal.set(totalQty);
            
            // Ensure totals are correct immediately
            this.refreshTotals();
          }
        }
      });
  }

  // ------------------------------
  // ADD ITEM TO CART
  // ------------------------------
  addToCart(productId: number, quantity = 1, unitPrice: number): any {
    const user = this.auth.currentUser();
    if (!user) {
      return new Observable(observer => observer.error(new Error("User not logged in.")));
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

              // Recalculate totals and set initial state immutably
              loadedCart.cartItems = loadedCart.cartItems.map(item => ({
                ...item,
                totalPrice: item.unitPrice * item.quantity
              }));
              
              this.cartSignal.set(loadedCart);
              this.refreshTotals();
              
              console.log("Cart loaded successfully before adding item.");
            } else {
              throw new Error("Cart not found in backend.");
            }
          }),
          // switchMap retries the entire addToCart logic now that cartSignal is populated
          switchMap(() => {
            return this.addToCart(productId, quantity, unitPrice);
          })
        );
    }

    // 2️⃣ Cart already exists → add item normally
    const dto = {
      cartId: cart.id,
      productId,
      quantity: Number(quantity),
      unitPrice,
      totalPrice: Number(unitPrice) * Number(quantity),
      createdBy: user.id
    };

    return this.api.post<{ result: GetCartItemDTO, isSuccess: boolean }>('api/cartitem', dto)
      .pipe(
        tap(res => {
          if (!res.isSuccess || !res.result) return;

          const addedItem = res.result;
          const current = this.cartSignal();
          if (!current) return;

          // Find the existing item
          const existing = current.cartItems.find(i => i.productId === addedItem.productId);

          if (existing) {
            // ⚠️ FIX: Ensure all values are numbers before adding to prevent NaN
            existing.quantity = Number(existing.quantity) + Number(addedItem.quantity);
            existing.totalPrice = Number(existing.totalPrice) + Number(addedItem.totalPrice);
          } else {
            // Push the new item
            current.cartItems.push(addedItem);
          }

          // ✅ IMPORTANT: Call refreshTotals() to sanitize and set the signal immutably
          this.refreshTotals();
        })
      );
  }

  // ------------------------------
  // UPDATE QUANTITY
  // ------------------------------
  updateQuantity(cartItemId: number, quantity: number): any {
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

          // update item - ENSURE THIS IS A NUMBER
          item.quantity = Number(res.result.quantity);

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
          
          // Update signal and totals
          this.cartSignal.set({ ...c });
          this.refreshTotals();
        })
      );
  }

  // ------------------------------
  // CLEAR CART
  // ------------------------------
  clearCart(): any {
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
        this.totalItemsSignal.set(0);
        console.log("Cart successfully cleared.");
      })
    );
  }

  // ------------------------------
  // PRIVATE HELPER: REFRESH TOTALS
  // ------------------------------
  private refreshTotals() {
    const cart = this.cartSignal();
    if (!cart) return;

    // 1. Create a NEW array of cartItems with sanitized numbers and recalculated totals
    const newCartItems = cart.cartItems.map(item => {
      // ⚠️ CRITICAL FIX: Ensure quantity is a safe number (falls back to 0 if NaN/null)
      const safeQuantity = Number(item.quantity) || 0;
      const safeUnitPrice = Number(item.unitPrice) || 0;

      return {
        ...item,
        quantity: safeQuantity, // Use the sanitized quantity
        totalPrice: safeUnitPrice * safeQuantity
      };
    });

    // 2. Calculate the NEW totalAmount from the NEW array
    const newTotalAmount = newCartItems.reduce(
      (sum, i) => sum + i.totalPrice, 0
    );
    
    // 3. Update total items count signal
    const totalQty = newCartItems.reduce((sum, i) => sum + i.quantity, 0);
    this.totalItemsSignal.set(totalQty);

    // 4. Set the signal with a NEW object (IMMUTABILITY)
    this.cartSignal.set({
      ...cart, // Copy existing properties
      cartItems: newCartItems, // Use the new, safe array
      totalAmount: newTotalAmount // Use the new total
    });
  }

}