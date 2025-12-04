import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductFilter, Product } from '../../../core/models/product.models';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material/material-module';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  standalone: false
})
export class SearchFilterComponent implements OnInit {
  @Input() currentFilter: ProductFilter = {};
  @Output() filterChange = new EventEmitter<ProductFilter>();
  
  filterForm: FormGroup;
  
  // Getter methods for form controls
  get searchControl() {
    return this.filterForm.get('search') as FormControl;
  }
  
  get minPriceControl() {
    return this.filterForm.get('minPrice') as FormControl;
  }
  
  get maxPriceControl() {
    return this.filterForm.get('maxPrice') as FormControl;
  }
  
  get minRatingControl() {
    return this.filterForm.get('minRating') as FormControl;
  }
  
  get sortByControl() {
    return this.filterForm.get('sortBy') as FormControl;
  }
  
  priceRanges = [
    { min: 1, max: 50, label: '$1 - $50' },
    { min: 50, max: 100, label: '$50 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: 500, label: '$200 - $500' },
    { min: 500, max: 1000, label: '$500 - $1000' },
    { min: 1000, max: null, label: 'Over $1000' }
  ];
  
  ratingOptions = [4.5, 4, 3.5, 3];
  
  sortOptions = [
    { value: 'latest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      minPrice: [null],
      maxPrice: [null],
      minRating: [null],
      sortBy: ['latest']
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.emitFilterChange();
    });
    
    if (this.currentFilter) {
      this.filterForm.patchValue(this.currentFilter, { emitEvent: false });
    }
  }

  private emitFilterChange(): void {
    const formValue = this.filterForm.value;
    const filter: ProductFilter = {};
    
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

  // ADD THIS METHOD
  clearFilters(): void {
    // Reset the form to default values
    this.filterForm.reset({
      search: '',
      minPrice: null,
      maxPrice: null,
      minRating: null,
      sortBy: 'latest'
    });
    
    // Emit an empty filter to update the parent
    this.filterChange.emit({});
  }

  selectPriceRange(min: number | null, max: number | null): void {
    this.filterForm.patchValue({
      minPrice: min,
      maxPrice: max
    });
  }

  selectRating(rating: number): void {
    this.filterForm.patchValue({
      minRating: rating
    });
  }

  isPriceRangeSelected(min: number | null, max: number | null): boolean {
    return this.filterForm.get('minPrice')?.value === min && 
           this.filterForm.get('maxPrice')?.value === max;
  }

  isRatingSelected(rating: number): boolean {
    return this.filterForm.get('minRating')?.value === rating;
  }
}