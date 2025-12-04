import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../services/admin-api.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './roles.html',
})
export class AdminRolesComponent implements OnInit {

  roles: any[] = [];
  newRole: string = '';

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.adminApi.getRoles().subscribe(res => {
      this.roles = res.result;
    });
  }

  createRole() {
    if (!this.newRole.trim()) return;

    this.adminApi.createRole(this.newRole).subscribe(() => {
      this.newRole = '';
      this.loadRoles();
    });
  }

  deleteRole(name: string) {
    if (!confirm('Delete role?')) return;

    this.adminApi.deleteRole(name).subscribe(() => {
      this.loadRoles();
    });
  }

}
