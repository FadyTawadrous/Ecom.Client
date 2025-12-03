import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api-service';
import { WishlistItem } from '../models/wishlist.models'; // create this model
import { Observable, tap, catchError, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PaginatedResponse} from '../models/pagination.models'; // for pagination

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private api = inject(ApiService);

  // --- STATE SIGNALS ---
  private wishlistSignal = signal<WishlistItem[]>([]);
  private totalItemsSignal = signal<number>(0);
  private pageNumSignal = signal<number>(1);
  private pageSizeSignal = signal<number>(3); // default page size

  readonly wishlist = this.wishlistSignal.asReadonly();
  readonly totalItems = this.totalItemsSignal.asReadonly();
  readonly pageNum = this.pageNumSignal.asReadonly();
  readonly pageSize = this.pageSizeSignal; // allow setting page size

  loading = signal<boolean>(false);

  // --- API METHODS ---
  // Load wishlist from backend as "PaginatedResponse<WishlistItem>" instead of just WishlistItem[]
  loadWishlist(pageNum = 1, pageSize = 10): Observable<PaginatedResponse<WishlistItem>> {
    this.loading.set(true);
    const params = new HttpParams()
      .set('pageNum', pageNum)
      .set('pageSize', pageSize);
    return this.api.get<PaginatedResponse<WishlistItem>>(`api/WishlistItem/Users/me/WishlistItems`, 
      params
    ).pipe(
      tap(
        //For paginated response
        res => {
          this.wishlistSignal.set(res.items);
          this.totalItemsSignal.set(res.totalCount);
          this.pageNumSignal.set(res.pageNumber);
          this.pageSizeSignal.set(res.pageSize);
          this.loading.set(false);
        }
      ),
      catchError(error => {
        console.error('Error loading wishlist:', error);
        this.loading.set(false);
        // Return empty response on error
        return of({
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: pageSize
        } as PaginatedResponse<WishlistItem>);
      }));
  }

  // Add a product to wishlist
  addToWishlist(productId: number): Observable<WishlistItem> {
    return this.api.post<WishlistItem>(`api/WishlistItem/WishlistItems`, { productId }).pipe(
      tap(item => {
        // avoid duplicates
        if (!this.wishlistSignal().some(i => i.productId === item.productId)) {
          this.wishlistSignal.set([...this.wishlistSignal(), item]);
          this.totalItemsSignal.set(this.totalItemsSignal() + 1); // update total items
        }
      })
    );
  }

  // Remove by wishlist item id
  removeFromWishlist(wishlistItemId: number): Observable<void> {
    return this.api.delete<void>(`api/WishlistItem/WishlistItems/${wishlistItemId}`).pipe(
      tap(() => {
        const updated = this.wishlistSignal().filter(i => i.id !== wishlistItemId);
        this.wishlistSignal.set(updated);
        this.totalItemsSignal.set(this.totalItemsSignal() - 1); // update total items
        if(this.wishlistSignal().length === 0 && this.pageNumSignal() > 1) {
          // If the current page is empty after deletion, go back one page
          console.log('Wishlist item removed:',  true);
          this.pageNumSignal.set(this.pageNumSignal() - 1);
          this.loadWishlist(this.pageNumSignal(), this.pageSizeSignal()).subscribe();
        }
        else if(this.wishlistSignal().length === 0 && this.pageNumSignal() === 1) {
          // If on the first page and it's empty, load the next page if exists
          if (this.totalItemsSignal() > 0) {
            this.pageNumSignal.set(1);
            this.loadWishlist(1, this.pageSizeSignal()).subscribe();
          }
        }
      }),
    );
  }

  // Toggle convenience method (search productId)
  toggleWishlist(productId: number): Observable<WishlistItem | void> {
    const existing = this.wishlistSignal().find(i => i.productId === productId);
    if (existing) {
      return this.removeFromWishlist(existing.id) as Observable<void>;
    } else {
      return this.addToWishlist(productId) as Observable<WishlistItem>;
    }
  }

  // Method to clear wishlist state (useful on logout)
  clearWishlist(): void {
    this.wishlistSignal.set([]);
    this.totalItemsSignal.set(0);
    this.pageNumSignal.set(1);
  }
}
