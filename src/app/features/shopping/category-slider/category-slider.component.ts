import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../core/models/Product.models';


@Component({
  selector: 'app-category-slider',
  templateUrl: './category-slider.component.html',
  styleUrls: ['./category-slider.component.scss'],
  standalone: false,
})
export class CategorySliderComponent {
  // INPUT 1: List of categories to display
  @Input() categories: Category[] = [];
  
  // INPUT 2: Currently selected category ID (if any)
  @Input() selectedCategoryId: number | null = null;
  
  // OUTPUT: Event when user selects a category
  @Output() categorySelected = new EventEmitter<number>();
  
  // Method called when user clicks "All Categories"
  selectAllCategories(): void {
    // Emit 0 or null to indicate "All Categories"
    this.categorySelected.emit(0);
  }
  
  // Method called when user clicks a specific category
  selectCategory(categoryId: number): void {
    this.categorySelected.emit(categoryId);
  }
  
  // Helper: Check if a category is currently selected
  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategoryId === categoryId;
  }
}