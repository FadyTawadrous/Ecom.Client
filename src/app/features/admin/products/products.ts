import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatTableModule,
    MatIconModule, MatSelectModule
  ],
  templateUrl: './products.html'
})
export class Products implements OnInit {

  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];

  editing = false;

  form = {
    id: 0,
    title: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    brandId: ''
  };

  thumbnail: File | null = null;
  thumbnailPreview: string | null = null;

  columns = ['name', 'category', 'brand', 'price', 'stock', 'actions'];

  constructor(public adminApi: AdminApiService) {}

  ngOnInit() {
    this.load();
    this.loadCategories();
    this.loadBrands();
  }

  // FILE SELECTION
  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.thumbnail = file;

      const reader = new FileReader();
      reader.onload = () => this.thumbnailPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  // LOAD PRODUCTS
  load() {
    this.adminApi.getProducts().subscribe(res => {
      this.products = res.result;
    });
  }

  loadCategories() {
    this.adminApi.getCategories().subscribe(res => this.categories = res.result);
  }

  loadBrands() {
    this.adminApi.getBrands().subscribe(res => this.brands = res.result);
  }

  // SAVE PRODUCT (CREATE/UPDATE)
  save() {

  if (!this.form.title.trim()) {
    alert('Title is required');
    return;
  }

  const fd = new FormData();

  fd.append("Id", String(this.form.id));
  fd.append("Title", this.form.title);
  fd.append("Description", this.form.description);
  fd.append("Price", String(this.form.price));
  fd.append("Stock", String(this.form.stock));

  fd.append("BrandId", this.form.brandId.toString());
  fd.append("CategoryId", this.form.categoryId.toString());
  fd.append("DiscountPercentage", "0");

  // SEND ONLY ONE OF THESE:

  if (this.editing) {
    fd.append("UpdatedBy", "admin");
  } else {
    fd.append("CreatedBy", "admin");
  }


  // FILE
  if (this.thumbnail) {
    fd.append("Thumbnail", this.thumbnail);
  }

  if (this.editing) {
    this.adminApi.updateProduct(fd).subscribe(() => this.reset());
  } else {
    this.adminApi.createProduct(fd).subscribe(() => this.reset());
  }
}


  // EDIT PRODUCT
  edit(p: any) {
    this.editing = true;

    this.form = {
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      stock: p.stock,
      categoryId: p.categoryId,
      brandId: p.brandId
    };

    // PREVIEW EXISTING IMAGE
    this.thumbnailPreview = this.adminApi.getImageUrl(p.thumbnailUrl);
    this.thumbnail = null;
  }

  delete(id: number) {
    this.adminApi.deleteProduct(id).subscribe(() => this.load());
  }

  reset() {
    this.form = {
      id: 0,
      title: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      brandId: ''
    };

    this.thumbnail = null;
    this.thumbnailPreview = null;
    this.editing = false;

    this.load();
  }
}
