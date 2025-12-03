
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list-component/product-list-component';
import { ProductDetailsComponent } from './product-details-component/product-details-component';
import { TestinComponent } from './testin.component/testin.component';


const routes: Routes = [
  { 
    path: '', 
    component: ProductListComponent 
  },
  { 
    path: 'category/:categoryId', 
    component: ProductListComponent 
  },
  { 
    path: 'brand/:brandId', 
    component: ProductListComponent 
  },
  { 
    path: 'search', 
    component: ProductListComponent 
  },
  { 
    path: 'product/:id', 
    component: ProductDetailsComponent 
  },
  { path: 'testing', component: TestinComponent },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule { }