import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayout } from '../../layout/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { Products } from './products/products';

import { authGuard } from '../../core/guards/auth.guard';
import { Orders } from './orders/orders';
import { Categories } from './categories/categories';
import { Brands } from './brands/brands';
import { AdminRolesComponent } from './roles/roles';
import { AdminUsersComponent } from './users/users';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'products', component: Products },
      { path: 'orders', component: Orders },
      { path: 'categories', component: Categories },
      { path: 'brands', component: Brands },
      { path: 'users', component: AdminUsersComponent },
      { path: 'roles', component: AdminRolesComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
