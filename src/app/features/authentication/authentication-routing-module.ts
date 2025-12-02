import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Login } from './login/login';
import { RegisterComponent } from './register-component/register-component';
import { ProfileComponent } from './profile-component/profile-component';
import { AddressComponent } from './address-component/address-component';
import { LoginCallbackComponent } from './login-callback-component/login-callback-component';
import { authGuard } from '../../core/guards/auth.guard';
import { AddressListComponent } from './address-list-component/address-list-component';
import { ConfirmEmailComponent } from './confirm-email-component/confirm-email-component';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'addresses', component: AddressListComponent, canActivate: [authGuard] },
  { path: 'callback', component: LoginCallbackComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Default to login
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
