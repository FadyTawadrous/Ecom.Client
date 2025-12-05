import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { About } from './shared/components/about/about';
import { Contact } from './shared/components/contact/contact';


// export const routes: Routes = [];

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module')
        .then(m => m.AdminModule),
    canActivate: [adminGuard]
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
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  {
    path: '',
    redirectTo: 'shopping',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/not-found/not-found-module').then(m => m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
