import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Brand } from '../../../core/models/Product.models';


@Component({
  selector: 'app-brand-slider',
  templateUrl: './brand-slider.component.html',
  styleUrls: ['./brand-slider.component.scss'],
  standalone: false,
})
export class BrandSliderComponent {
  // INPUT 1: List of brands to display
  @Input() brands: Brand[] = [];
  
  // INPUT 2: Currently selected brand ID (if any)
  @Input() selectedBrandId: number | null = null;
  
  // OUTPUT: Event when user selects a brand
  @Output() brandSelected = new EventEmitter<number>();
  
  // Method called when user clicks "All Brands"
  selectAllBrands(): void {
    // Emit 0 to indicate "All Brands"
    this.brandSelected.emit(0);
  }
  
  // Method called when user clicks a specific brand
  selectBrand(brandId: number): void {
    this.brandSelected.emit(brandId);
  }
  
  // Helper: Check if a brand is currently selected
  isBrandSelected(brandId: number): boolean {
    return this.selectedBrandId === brandId;
  }
  
  // Helper: Get brand logo or use default
  getBrandLogo(brand: Brand): string {
    return brand.imageUrl || 'assets/default-brand.png';
  }
}