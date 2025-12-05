import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OrdersHistoryComponent } from './orders-history/orders-history.component';
import { OrderDetailsComponent } from './order-details/order-details-component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    OrdersHistoryComponent,
    OrderDetailsComponent
  ],
})
export class OrdersModule {}
