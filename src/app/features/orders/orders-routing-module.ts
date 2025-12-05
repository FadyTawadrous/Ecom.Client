import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { OrderListComponent } from './order-list/order-list-component';
import { OrderDetailsComponent } from './order-details/order-details-component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation-component';
import { OrdersHistoryComponent } from './orders-history/orders-history.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersHistoryComponent
  },
  // { path: 'list', component: OrderListComponent },
  { path: ':id', component: OrderDetailsComponent },
  { path: 'confirmation/:id', component: OrderConfirmationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
