import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ProductFilter } from '../../../core/models/Product.models';
import { MaterialModule } from '../../../shared/material/material-module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  imports: [MaterialModule]
})
export class SearchFilterComponent implements OnInit {
  // INPUT: Current filter values from parent
  @Input() currentFilter: ProductFilter = {};
  
  // OUTPUT: Emits when filter changes
  @Output() filterChange = new EventEmitter<ProductFilter>();
  
  // Our filter form
  filterForm: FormGroup;
  
  // Price range options (predefined)
  priceRanges = [
    { min: 0, max: 50, label: 'Under $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: 500, label: '$200 - $500' },
    { min: 500, max: 1000, label: '$500 - $1000' },
    { min: 1000, max: null, label: 'Over $1000' }
  ];
  
  // Rating options (minimum stars)
  ratingOptions = [4.5, 4, 3.5, 3];
  
  // Sort options
  sortOptions = [
    { value: 'latest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  constructor(private fb: FormBuilder) {
    // Initialize the form
    this.filterForm = this.fb.group({
      search: [''],           // Search text
      minPrice: [null],       // Minimum price
      maxPrice: [null],       // Maximum price
      minRating: [null],      // Minimum rating
      sortBy: ['latest']      // Sort option
    });
  }

  ngOnInit(): void {
    // When form changes, emit to parent
    this.filterForm.valueChanges.subscribe(() => {
      this.emitFilterChange();
    });
    
    // Set initial values if provided
    if (this.currentFilter) {
      this.filterForm.patchValue(this.currentFilter, { emitEvent: false });
    }
  }

  // Emit the current filter values to parent
  private emitFilterChange(): void {
    const formValue = this.filterForm.value;
    const filter: ProductFilter = {};
    
    // Only include non-empty values
    if (formValue.search?.trim()) {
      filter.search = formValue.search.trim();
    }
    
    if (formValue.minPrice) {
      filter.minPrice = formValue.minPrice;
    }
    
    if (formValue.maxPrice) {
      filter.maxPrice = formValue.maxPrice;
    }
    
    if (formValue.minRating) {
      filter.minRating = formValue.minRating;
    }
    
    if (formValue.sortBy) {
      // Parse sortBy into sortBy and sortOrder
      if (formValue.sortBy === 'price_asc') {
        filter.sortBy = 'price';
        filter.sortOrder = 'asc';
      } else if (formValue.sortBy === 'price_desc') {
        filter.sortBy = 'price';
        filter.sortOrder = 'desc';
      } else if (formValue.sortBy === 'name_asc') {
        filter.sortBy = 'name';
        filter.sortOrder = 'asc';
      } else if (formValue.sortBy === 'name_desc') {
        filter.sortBy = 'name';
        filter.sortOrder = 'desc';
      } else {
        filter.sortBy = formValue.sortBy;
      }
    }
    
    this.filterChange.emit(filter);
  }

  // Clear all filters
  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      minPrice: null,
      maxPrice: null,
      minRating: null,
      sortBy: 'latest'
    });
  }

  // Select a price range (convenience method)
  selectPriceRange(min: number | null, max: number | null): void {
    this.filterForm.patchValue({
      minPrice: min,
      maxPrice: max
    });
  }

  // Select a minimum rating (convenience method)
  selectRating(rating: number): void {
    this.filterForm.patchValue({
      minRating: rating
    });
  }

  // Check if a price range is selected
  isPriceRangeSelected(min: number | null, max: number | null): boolean {
    return this.filterForm.get('minPrice')?.value === min && 
           this.filterForm.get('maxPrice')?.value === max;
  }

  // Check if a rating is selected
  isRatingSelected(rating: number): boolean {
    return this.filterForm.get('minRating')?.value === rating;
  }
}