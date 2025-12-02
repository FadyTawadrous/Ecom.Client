import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Wishlist } from './wishlist'; 
import { authGuard } from '../../core/guards/auth.guard'; // only logged-in users can see wishlist

const routes: Routes = [
  { path: '', component: Wishlist, 
    canActivate: [authGuard] 
  } // default page for /wishlist
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishlistRoutingModule {}
