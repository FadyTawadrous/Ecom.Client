// shopping.module.ts - FIXED
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingRoutingModule } from './shopping-routing-module';
import { MaterialModule } from '../../shared/material/material-module';
import { ProductService } from '../../core/services/product-service';

// Components
import { ProductListComponent } from './product-list-component/product-list-component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductDetailsComponent } from './product-details-component/product-details-component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { CategorySliderComponent } from './category-slider/category-slider.component';
import { BrandSliderComponent } from './brand-slider/brand-slider.component';

@NgModule({
  declarations: [
    // ✅ ALL components in declarations
    ProductCardComponent,
    CategorySliderComponent,
    BrandSliderComponent,
    SearchFilterComponent,
    ProductDetailsComponent,
    ProductListComponent,
    ProductReviewComponent,
  ],
  imports: [
    // ✅ Only modules here
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ShoppingRoutingModule,
    MaterialModule,
  ],
  providers: [
    ProductService
  ]
})
export class ShoppingModule { }