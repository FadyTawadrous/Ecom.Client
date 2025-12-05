import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';
import { WishlistService } from '../../../core/services/wishlist-service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from "../../material/material-module";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit{

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  // Signals
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  totalCartItems = this.cartService.totalItems;
  totalWishlistItems = this.wishlistService.totalItems;

  //defaultImage = 'avatar.jpg';

  showSearch = signal<boolean>(false);
  searchQuery = '';
  innerWidth = window.innerWidth;

  constructor() {
    // Watch for authentication changes and load wishlist when user logs in
    effect(() => {
      if (this.isAuthenticated()) {
        // Load some wishlist data when user is authenticated
        this.wishlistService.loadWishlist(1, this.wishlistService.pageSize()).subscribe();
        // Load cart data as well
        this.cartService.loadCart();
      }
    });
  }

  ngOnInit() {
    // Load cart and some wishlist on component init if user is already authenticated
    if (this.isAuthenticated()) {
      this.wishlistService.loadWishlist(1, this.wishlistService.pageSize()).subscribe();
      this.cartService.loadCart();
    }
  }

  toggleSearch() {
    this.showSearch.set(!this.showSearch());
  }

  performSearch() {
    if (!this.searchQuery) return;
    console.log('Searching for:', this.searchQuery);
    // implement navigation or API call
  }

  getInitials(name?: string): string {
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  isAdmin(): boolean {
    // Check roles if available in your User model
    return this.authService.currentUser()?.roles?.includes('Admin') || false;
  }
  
  logout() {
    this.wishlistService.clearWishlist(); // Clear wishlist on logout
    this.cartService.clearCart(); // Clear cart on logout
    this.authService.logout();
  }

  // Handle broken image links (e.g. file deleted on server)
  handleImageError(event: any) {
    // If the image fails to load, switch to the default image in assets
    //event.target.src = this.defaultImage;
  }

  isMobile() {
    return this.innerWidth < 640; // Tailwind sm breakpoint
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }
}
