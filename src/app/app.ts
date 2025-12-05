import { Component, OnInit, signal,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { Login } from './components/login/login';
import { AuthService } from './core/services/auth-service';
import { SharedModule } from './shared/shared-module'; // Used for shared components, pipes, directives, etc.
import { CoreModule } from './core/core-module'; // Used for singleton services, guards, interceptors, etc.

import { MainLayout } from './layout/main-layout/main-layout/main-layout';
import { CartService } from './core/services/cart-service';

@Component({
  selector: 'app-root',
  imports: [SharedModule, MainLayout, CoreModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private http: HttpClient) {}

  protected readonly title = signal('Ecom.Client');
  auth = inject(AuthService); 
  cartService = inject(CartService);
  // userId = "081d0d65-8f7b-4375-afd2-81cf2664fe6e"; // replace later with auth
  cartId: number | null = null;

  get userId(): string | null {
    return this.auth.currentUser()?.id ?? null;
  }

  ngOnInit() {
    if (this.userId) {
    this.cartService.loadCart();
    }
    // this.cartService.getUserCart(this.userId!).subscribe({
    //   next: (res) => {
    //     if (res.isSuccess) {
    //       this.cartId = res.result.id;
    //       console.log("Loaded CartId =", this.cartId);
    //       localStorage.setItem('cartId', this.cartId!.toString());
    //     }
    //   }
    // });
  }

}
