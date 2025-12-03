import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';

import { MaterialModule } from '../../../shared/material/material-module';

@Component({
  selector: 'app-test-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './test-navbar.html',
  styleUrl: './test-navbar.scss',
})
export class TestNavbar {

  authService = inject(AuthService);

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

}
