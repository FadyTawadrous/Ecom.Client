import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';
import { WishlistService } from '../../../core/services/wishlist-service'; // optional if you have wishlist
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatIconModule], // no CommonModule needed with @if
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  // Signals
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  totalCartItems = this.cartService.totalItems;
  totalWishlistItems = this.wishlistService.totalItems;

  logout() {
    this.authService.logout();
  }
}
