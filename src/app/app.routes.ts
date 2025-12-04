import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';


// export const routes: Routes = [];

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
    import('./features/admin/admin.module')
      .then(m => m.AdminModule)
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./features/authentication/authentication-module').then(m => m.AuthenticationModule),
    //canActivate: [authGuard] // use authGuard if module needs protection
  },
  {
    path: 'shopping',
    loadChildren: () =>
      import('./features/shopping/shopping-module').then(m => m.ShoppingModule)
  },
  {
    path: 'wishlist',
    loadChildren: () =>
      import('./features/wishlist/wishlist-module').then(m => m.WishlistModule)
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart-module').then(m => m.CartModule)
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('./features/payments/payments-module').then(m => m.PaymentsModule)
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/orders-module').then(m => m.OrdersModule)
  },
  {
    path: '',
    redirectTo: 'shopping',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'shopping'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
