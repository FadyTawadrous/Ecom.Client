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
export class Navbar {

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  // Signals
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;
  totalCartItems = this.cartService.totalItems;
  totalWishlistItems = this.wishlistService.totalItems;

  //defaultImage = 'avatar.jpg';

  showSearch = signal(false);
  searchQuery = '';
  innerWidth = window.innerWidth;

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
