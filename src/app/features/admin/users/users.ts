import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AdminApiService } from '../services/admin-api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AdminUsersComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'roles', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadUsers();

    this.dataSource.filterPredicate = (data: any, filter: string) =>
      JSON.stringify(data).toLowerCase().includes(filter);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadUsers() {
    this.adminApi.getUsers().subscribe(res => {
      const users = res.result || [];

      // First, normalize image URLs
      users.forEach((u: any) => {
        u.profileImageUrl = this.adminApi.getImageUrl(u.profileImageUrl);
      });

      this.dataSource.data = users;

      // Then load roles for each user
      users.forEach((u: any) => {
        this.adminApi.getUserRoles(u.id).subscribe(r => {
          u.roles = r.result || [];
          this.dataSource._updateChangeSubscription();
        });
      });
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  deleteUser(id: string): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.adminApi.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }
}
