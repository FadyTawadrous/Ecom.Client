import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';


// export const routes: Routes = [];

export const routes: Routes = [
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
  path: 'payment',
  loadChildren: () =>
    import('./features/payments/payments.route').then(m => m.PAYMENT_ROUTES)
},
{
  path: 'order/success/:orderId',
  loadComponent: () =>
    import('./features/payments/payment-success.component').then(m => m.PaymentSuccessComponent)
},

{
  path: 'order/cancel',
  loadComponent: () =>
    import('./features/payments/payment-cancel.component').then(m => m.PaymentCancelComponent)
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
