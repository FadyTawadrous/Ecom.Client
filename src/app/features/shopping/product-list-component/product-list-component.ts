import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Product, ProductFilter, Category, Brand } from '../../../core/models/product.models';
import { PageEvent } from '@angular/material/paginator';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { WishlistService } from '../../../core/services/wishlist-service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.scss'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  private toast = inject(ToastService);
  
  @ViewChild(SearchFilterComponent) searchFilterComponent!: SearchFilterComponent;
  
  // Products data
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  
  // Loading and error states
  isLoading = signal<boolean>(false);
  error: string | null = null;
  
  // Pagination
  totalProducts = 0;
  pageSize = 12;
  currentPage = 0;
  pageSizeOptions = [12, 24, 48];
  
  // Filters
  currentFilter: ProductFilter = {};
  selectedCategoryId: number | null = null;
  selectedBrandId: number | null = null;
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load initial data
    this.loadCategories();
    this.loadBrands();
    this.setupRouteParams();
    this.loadProducts();
  }

  // Setup route parameters for category/brand filtering
  private setupRouteParams(): void {
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        const id = +params['categoryId'];

        this.selectedCategoryId = id;
        this.currentFilter = { ...this.currentFilter, categoryId: id };

        // ⬅ NEW: Fetch selected category info
        this.productService.getCategoryById(id).subscribe(category => {
          console.log("Selected category:", category);
        });

      } else if (params['brandId']) {
        const id = +params['brandId'];

        this.selectedBrandId = id;
        this.currentFilter = { ...this.currentFilter, brandId: id };

        // ⬅ NEW: Fetch selected brand info
        this.productService.getBrandById(id).subscribe(brand => {
          console.log("Selected brand:", brand);
        });
      }
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    console.log('loading products', this.isLoading());
    // 1️⃣ Category has highest priority
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
        next: products => {
          this.products = products;
          this.totalProducts = products.length;
          this.isLoading.set(false);
          console.log('stop loading', this.isLoading());
        },
        error: console.error
      });
      return;
    }

    // 2️⃣ Brand second priority
    if (this.selectedBrandId) {
      this.productService.getProductsByBrand(this.selectedBrandId).subscribe({
        next: products => {
          this.products = products;
          this.totalProducts = products.length;
          this.isLoading.set(false);
          console.log('stop loading', this.isLoading());
        },
        error: console.error
      });
      return;
    }

    if (this.currentFilter) {
      this.productService.filterProducts(this.currentFilter).subscribe({
        next: products => {
          this.products = products;
          this.totalProducts = products.length;
          this.isLoading.set(false);
          console.log('stop loading', this.isLoading());        
        },
        error: console.error
      });
    }
  }

  // Load categories for the slider
  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        const filteredCategories: any[] = [];

        categories.forEach(category => {
          this.productService.getProductsByCategory(category.id).subscribe({
            next: (products) => {
              // Keep only categories that actually have products
              if (products && products.length > 0) {
                filteredCategories.push(category);
              }
              // Update list only after finishing
              this.categories = filteredCategories;
            }
          });
        });
      },
      error: (err) => console.error("Failed to load categories:", err)
    });
  }

  // Load brands for the slider
  loadBrands(): void {
    this.productService.getAllBrands().subscribe({
      next: (brands) => {
        const filteredBrands: any[] = [];

        brands.forEach(brand => {
          this.productService.getProductsByBrand(brand.id).subscribe({
            next: (products) => {
              // Keep only brands with products
              if (products && products.length > 0) {
                filteredBrands.push(brand);
              }
              // Update result list
              this.brands = filteredBrands;
            }
          });
        });
      },
      error: (err) => console.error("Failed to load brands:", err)
    });
  }

  // Event Handlers

  // When user selects a category
  onCategorySelected(categoryId: number): void {
    if (categoryId === 0) {
      this.selectedCategoryId = null;
      this.currentFilter.categoryId = undefined;
      this.router.navigate(['/shopping']);
      this.loadProducts();
      return;
    }

    this.selectedCategoryId = categoryId;

    // NEW: fetch selected category
    this.productService.getCategoryById(categoryId).subscribe(category => {
      console.log("Selected category details:", category);
    });

    this.currentFilter = { ...this.currentFilter, categoryId };

    this.router.navigate(['/shopping/category', categoryId]);
    this.loadProducts();
  }

  // When user selects a brand
  onBrandSelected(brandId: number): void {
    if (brandId === 0) {
      this.selectedBrandId = null;
      this.currentFilter.brandId = undefined;
      this.router.navigate(['/shopping']);
      this.loadProducts();
      return;
    }

    this.selectedBrandId = brandId;

    // NEW: fetch selected brand
    this.productService.getBrandById(brandId).subscribe(brand => {
      console.log("Selected brand details:", brand);
    });

    this.currentFilter = { ...this.currentFilter, brandId };

    this.router.navigate(['/shopping/brand', brandId]);
    this.loadProducts();
  }

  // When filter changes from search-filter component
  onFilterChange(filter: ProductFilter): void {
    this.currentFilter = { ...this.currentFilter, ...filter };
    this.currentPage = 0;
    this.loadProducts();
  }

  // When page changes
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  clearFiltersList(): void {
    this.selectedCategoryId = null;
    this.selectedBrandId = null;
    this.searchQuery = '';
    this.currentFilter = {};
    this.currentPage = 0;
    
    // Clear the search filter component's form
    if (this.searchFilterComponent) {
      this.searchFilterComponent.clearFilters();
    }
    
    // Reset URL
    this.router.navigate(['/shopping']);
    this.loadProducts();
  }

  // Add to cart
  onAddToCart(product: Product): void {
    // 1. Authentication Check
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated. Cannot add to cart.');
      this.toast.warn('Please log in to add items to your cart!');
      return;
    }

    // 2. Safety guard
    if (!product?.id) return; 

    console.log("ProductList received:", product);

    // 3. Add to cart via service
    this.cartService.addToCart(product.id, 1, product.price).subscribe({
      next: () => {
        console.log("Added to cart successfully");
        this.toast.success('Item added to cart!');
      },
      error: () => {
        console.error("Failed to add product to cart");
        this.toast.error('Failed to add item to cart.');
      }
    });
  }

  // Add to wishlist
  onAddToWishlist(product: Product): void {
    console.log(this.authService.isAuthenticated());
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated. Cannot add to wishlist.');
      this.toast.warn('Please log in to add items to your wishlist!');
      return;
    }

    console.log('Add to wishlist:', product);
    
    this.wishlistService.addToWishlist(product.id).subscribe({
      next: (item) => {
        if (item) this.toast.success('Item successfully added to wishlist!');
        else this.toast.warn('Item already exists in wishlist!');
      },
      error: (err) => this.toast.error('Something went wrong')
    });
  }

  // Get page title based on current filters
  get pageTitle(): string {
    if (this.selectedCategoryId) {
      const category = this.categories.find(c => c.id === this.selectedCategoryId);
      return `${category?.name || 'Category'} Products`;
    } else if (this.selectedBrandId) {
      const brand = this.brands.find(b => b.id === this.selectedBrandId);
      return `${brand?.name || 'Brand'} Products`;
    } else if (this.searchQuery) {
      return `Search Results for "${this.searchQuery}"`;
    } else {
      return 'All Products';
    }
  }

  // Check if any filter is active
  get hasActiveFilters(): boolean {
    return !!this.selectedCategoryId || 
           !!this.selectedBrandId || 
           !!this.currentFilter.search ||
           !!this.currentFilter.minPrice ||
           !!this.currentFilter.maxPrice ||
           !!this.currentFilter.minRating;
  }

  // Get products for current page
  get paginatedProducts(): Product[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.products.slice(start, end);
  }
}