import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist-service';
import { WishlistItemComponent } from './wishlist-item/wishlist-item';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, WishlistItemComponent, PaginatorComponent],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss'],
})
export class Wishlist implements OnInit {
  private wishlistService = inject(WishlistService);

  wishlist = this.wishlistService.wishlist;
  pageNum = this.wishlistService.pageNum;
  pageSize = this.wishlistService.pageSize;
  totalItems = this.wishlistService.totalItems;
  loading = this.wishlistService.loading;

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.wishlistService.loadWishlist(page, this.pageSize()).subscribe();
  }

  changePageSize(newSize: number) {
    this.wishlistService.pageSize.set(newSize); // update the service signal
    this.loadPage(1); // reload first page with new page size
  }

  removeItem(itemId: number) {
    this.wishlistService.removeFromWishlist(itemId).subscribe();
  }  
}
