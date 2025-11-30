import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api-service';
import { WishlistItem } from '../models/wishlist.models'; // create this model
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private api = inject(ApiService);

  // --- STATE SIGNAL ---
  private wishlistSignal = signal<WishlistItem[]>([]);

  readonly wishlist = this.wishlistSignal.asReadonly();
  readonly totalItems = computed(() => this.wishlistSignal().length);

  // --- API METHODS ---

  loadWishlist(): Observable<WishlistItem[]> {
    return this.api.get<WishlistItem[]>('wishlist').pipe(
      tap(items => this.wishlistSignal.set(items))
    );
  }

  addToWishlist(productId: number): Observable<WishlistItem> {
    return this.api.post<WishlistItem>('wishlist/add', { productId }).pipe(
      tap(item => {
        this.wishlistSignal.set([...this.wishlistSignal(), item]);
      })
    );
  }

  removeFromWishlist(wishlistItemId: number): Observable<void> {
    return this.api.delete<void>(`wishlist/items/${wishlistItemId}`).pipe(
      tap(() => {
        const updated = this.wishlistSignal().filter(i => i.id !== wishlistItemId);
        this.wishlistSignal.set(updated);
      })
    );
  }

  clearWishlist(): void {
    this.wishlistSignal.set([]);
  }
}
