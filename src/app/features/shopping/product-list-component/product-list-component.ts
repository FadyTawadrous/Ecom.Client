
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product-service';
import { Product, ProductFilter, Category, Brand } from '../../../core/models/Product.models';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-component.html',
  styleUrls: ['./product-list-component.scss'], 
   standalone: false
  
})
export class ProductListComponent implements OnInit {
  // Products data
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  
  // Loading and error states
  isLoading = false;
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


  // Load products with current filters
//  loadProducts(): void {
//   if (this.selectedCategoryId) {
//     this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
//       next: (products) => {
//         this.products = products;
//         this.totalProducts = products.length;
//       },
//       error: console.error
//     });
//   }
//   else if (this.selectedBrandId) {
//     this.productService.getProductsByBrand(this.selectedBrandId).subscribe({
//       next: (products) => {
//         this.products = products;
//         this.totalProducts = products.length;
//       },
//       error: console.error
//     });
//   }

//   else {
//     // default: load all
//     this.productService.getAllProducts(this.currentFilter).subscribe({
//       next: (products) => {
//         this.products = products;
//         this.totalProducts = products.length;
//       },
//       error: console.error
//     });
//   }
// }
loadProducts(): void {

  // 1️⃣ Category has highest priority
  if (this.selectedCategoryId) {
    this.productService.getProductsByCategory(this.selectedCategoryId).subscribe({
      next: products => {
        this.products = products;
        this.totalProducts = products.length;
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
      },
      error: console.error
    });
    return;
  }

  // 3️⃣ Search by title
  if (this.currentFilter.search) {
    this.productService.searchProductsByTitle(this.currentFilter.search).subscribe({
      next: products => {
        this.products = products;
        this.totalProducts = products.length;
      },
      error: console.error
    });
    return;
  }

  // 4️⃣ Price range filter
  if (this.currentFilter.minPrice || this.currentFilter.maxPrice) {
    this.productService.searchProductsByPrice(
      this.currentFilter.minPrice,
      this.currentFilter.maxPrice

    ).subscribe({
      next: products => {
        this.products = products;
        this.totalProducts = products.length;
         console.log('price filter success');
      },
      error: console.error
    });
    return;
  }

  // 5️⃣ Rating filter
  if (this.currentFilter.minRating) {
    this.productService.searchProductsByRating(this.currentFilter.minRating).subscribe({
      next: products => {
        this.products = products;
        this.totalProducts = products.length;
      },
      error: console.error
    });
    return;
  }

  // 6️⃣ Default → load all
  this.productService.getAllProducts().subscribe({
    next: products => {
      this.products = products;
      this.totalProducts = products.length;
    },
    error: console.error
  });
}





  // Load categories for the slider
  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  // Load brands for the slider
  loadBrands(): void {
    this.productService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
       
        
      },
      error: (err) => {
        console.error('Failed to load brands:', err);
        
      }
    });
  }

  // Event Handlers

  //When user selects a category
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
    console.log(this.currentFilter);
    
    
  }



  // When page changes
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // Clear all filters
  clearFilters(): void {
    this.selectedCategoryId = null;
    this.selectedBrandId = null;
    this.searchQuery = '';
    this.currentFilter = {};
    this.currentPage = 0;
    
    // Reset URL
    this.router.navigate(['/shopping']);
    this.loadProducts();
  }

  // Add to cart (to be implemented)
  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    // TODO: Implement cart service
  }

  // Add to wishlist (to be implemented)
  onAddToWishlist(product: Product): void {
    console.log('Add to wishlist:', product);
    // TODO: Implement wishlist service
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