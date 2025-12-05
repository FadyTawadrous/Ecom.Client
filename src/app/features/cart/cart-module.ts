import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing-module';
import { Cart } from './components/cart/cart';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CartRoutingModule,
    Cart
  ]
})
export class CartModule { }
