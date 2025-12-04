import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './brands.html',
  styleUrl: './brands.scss'
})
export class Brands implements OnInit {

  brands: any[] = [];

  editing = false;
  selected: any = null;
  previewImage: string | null = null;

  displayedColumns = ['name', 'actions'];

  model = {
    id: 0,
    name: '',
    image: null as File | null
  };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.adminApi.getBrands().subscribe(res => {
      this.brands = (res.result || []).map((b: any) => ({
        ...b,
        imageFullUrl: this.adminApi.getImageUrl(b.imageUrl)
      }));
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.model.image = file;

    const reader = new FileReader();
    reader.onload = () => this.previewImage = reader.result as string;
    reader.readAsDataURL(file);
  }

  createBrand() {
    const fd = new FormData();
    fd.append('Name', this.model.name);
    if (this.model.image) fd.append('Image', this.model.image);

    this.adminApi.createBrand(fd).subscribe(() => {
      this.resetForm();
      this.loadBrands();
    });
  }

  updateBrand() {
    const fd = new FormData();
    fd.append('Id', this.model.id.toString());
    fd.append('Name', this.model.name);
    if (this.model.image) fd.append('Image', this.model.image);

    this.adminApi.updateBrand(fd).subscribe(() => {
      this.resetForm();
      this.loadBrands();
    });
  }

  deleteBrand(id: number) {
    if (!confirm('Delete brand?')) return;
    this.adminApi.deleteBrand(id).subscribe(() => this.loadBrands());
  }

  edit(brand: any) {
    this.editing = true;
    this.selected = brand;
    this.model.name = brand.name;
    this.model.id = brand.id;
    //this.previewImage = brand.imageFullUrl || this.adminApi.getImageUrl(brand.imageUrl);
  }

  resetForm() {
    this.model = { id: 0, name: '', image: null };
    this.editing = false;
    this.selected = null;
    this.previewImage = null;
  }
}
