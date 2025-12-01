import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ShoppingRoutingModule } from './shopping-routing-module';

import { ProductListComponent } from './product-list-component/product-list-component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductDetailsComponent } from './product-details-component/product-details-component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { CategorySliderComponent } from './category-slider/category-slider.component';
import { BrandSliderComponent } from './brand-slider/brand-slider.component';
import { MaterialModule } from '../../shared/material/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Services
import { ProductService } from '../../core/services/product-service';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ShoppingRoutingModule,
    ProductReviewComponent,
    BrandSliderComponent,
    CategorySliderComponent,
    SearchFilterComponent,
    ProductDetailsComponent,
    ProductCardComponent,
    ProductListComponent,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
    
   
    
    

  ],
   providers: [
    ProductService
  ]
})
export class ShoppingModule { }


