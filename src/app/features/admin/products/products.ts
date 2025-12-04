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

  columns: string[] = ['name', 'category', 'brand', 'price', 'stock', 'actions'];

  constructor(private adminApi: AdminApiService) {}

  ngOnInit() {
    this.load();
    this.loadCategories();
    this.loadBrands();
  }

  load() {
    this.adminApi.getProducts()
      .subscribe(res => this.products = res.result);
  }

  loadCategories() {
    this.adminApi.getCategories()
      .subscribe(res => this.categories = res.result);
  }

  loadBrands() {
    this.adminApi.getBrands()
      .subscribe(res => this.brands = res.result);
  }

  save() {

    if (!this.form.title.trim()) {
      alert('Title is required');
      return;
    }

    const fd = new FormData();

    fd.append('Id', this.form.id.toString());
    fd.append('Title', this.form.title);
    fd.append('Description', this.form.description);
    fd.append('Price', this.form.price.toString());
    fd.append('Stock', this.form.stock.toString());

    if (this.form.categoryId)
      fd.append('CategoryId', this.form.categoryId);

    if (this.form.brandId)
      fd.append('BrandId', this.form.brandId);

    this.editing
      ? this.adminApi.updateProduct(fd).subscribe(() => this.reset())
      : this.adminApi.createProduct(fd).subscribe(() => this.reset());
  }

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
  }

  delete(id: number) {
    this.adminApi.deleteProduct(id)
      .subscribe(() => this.load());
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

    this.editing = false;
    this.load();
  }
}
