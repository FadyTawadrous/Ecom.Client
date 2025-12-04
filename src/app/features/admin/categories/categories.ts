import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../services/admin-api.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories implements OnInit {

  categories: any[] = [];
  editing = false;
  selected: any = null;
  previewImage: string | null = null;

  model = {
    id: 0,
    name: '',
    image: null as File | null
  };

  displayedColumns = ['name', 'actions'];

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.adminApi.getCategories().subscribe(res => {
      this.categories = (res.result || []).map((c: any) => ({
        ...c,
        imageFullUrl: this.adminApi.getImageUrl(c.imageUrl)
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

  createCategory() {
    const fd = new FormData();
    fd.append('Name', this.model.name);
    if (this.model.image) fd.append('Image', this.model.image);

    this.adminApi.createCategory(fd).subscribe(() => {
      this.resetForm();
      this.loadCategories();
    });
  }

  updateCategory() {
    const fd = new FormData();
    fd.append('Id', this.model.id.toString());
    fd.append('Name', this.model.name);
    if (this.model.image) fd.append('Image', this.model.image);

    this.adminApi.updateCategory(fd).subscribe(() => {
      this.resetForm();
      this.loadCategories();
    });
  }

  edit(cat: any) {
    this.editing = true;
    this.selected = cat;
    this.model.id = cat.id;
    this.model.name = cat.name;
    //this.previewImage = cat.imageFullUrl || this.adminApi.getImageUrl(cat.imageUrl);
  }

  deleteCategory(id: number) {
    if (!confirm('Soft delete this category?')) return;
    this.adminApi.deleteCategory(id).subscribe(() => this.loadCategories());
  }

  resetForm() {
    this.model = { id: 0, name: '', image: null };
    this.previewImage = null;
    this.selected = null;
    this.editing = false;
  }
}
