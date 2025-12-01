import { Component, OnInit ,  computed,  inject, signal} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Product, ProductFilter, Category } from '../../../core/models/Product.models';
import { PageEvent } from '@angular/material/paginator';
import{ MaterialModule } from '../../../shared/material/material-module';
import { CategorySliderComponent } from '../category-slider/category-slider.component';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.scss'],
  imports: [MaterialModule]
})
export class ProductListComponent implements OnInit {

  
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ✅ Signals for state
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Pagination signals
  totalProducts = signal(0);
  pageSize = signal(12);
  currentPage = signal(0);
  
  // Filter signals
  currentFilter = signal<ProductFilter>({});
  selectedCategoryId = signal<number | null>(null);
  selectedBrandId = signal<number | null>(null);
  
  // ✅ Computed signals
  pageTitle = computed(() => {
    if (this.selectedCategoryId()) {
      const category = this.categories().find(c => c.id === this.selectedCategoryId());
      return `${category?.name || 'Category'} Products`;
    } else if (this.selectedBrandId()) {
      return 'Brand Products';
    } else if (this.currentFilter().search) {
      return `Search Results for "${this.currentFilter().search}"`;
    } else {
      return 'All Products';
    }
  });
  
  showEmptyState = computed(() => 
    !this.isLoading() && this.products().length === 0 && !this.error()
  );
  
  paginatedProducts = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.products().slice(start, start + this.pageSize());
  });
  
  ngOnInit(): void {
    this.loadCategories();
    this.setupRouteParams();
  }
  
  private setupRouteParams(): void {
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        const categoryId = +params['categoryId'];
        this.selectedCategoryId.set(categoryId);
        this.currentFilter.update(filter => ({ ...filter, categoryId }));
      } else if (params['brandId']) {
        const brandId = +params['brandId'];
        this.selectedBrandId.set(brandId);
        this.currentFilter.update(filter => ({ ...filter, brandId }));
      }
      this.loadProducts();
    });

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['search']) {
        this.currentFilter.update(filter => ({ 
          ...filter, 
          search: queryParams['search'] 
        }));
        this.loadProducts();
      }
    });
  }
  
  private loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error('Failed to load categories:', err)
    });
  }
  
  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getAllProducts(this.currentFilter()).subscribe({
      next: (products) => {
        this.products.set(products);
        this.totalProducts.set(products.length);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading products:', err);
      }
    });
  }
  
  // Event Handlers
  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onFilterChange(filter: ProductFilter): void {
    this.currentFilter.set(filter);
    this.currentPage.set(0);
    this.loadProducts();
  }

  onCategorySelect(categoryId: number): void {
    this.selectedCategoryId.set(categoryId);
    this.selectedBrandId.set(null);
    this.currentFilter.set({ categoryId });
    this.currentPage.set(0);
    this.loadProducts();
    
    // Update URL
    this.router.navigate(['/shopping/category', categoryId]);
  }

  clearFilters(): void {
    this.selectedCategoryId.set(null);
    this.selectedBrandId.set(null);
    this.currentFilter.set({});
    this.currentPage.set(0);
    this.loadProducts();
    this.router.navigate(['/shopping']);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}