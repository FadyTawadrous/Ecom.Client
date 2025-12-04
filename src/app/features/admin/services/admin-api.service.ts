import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export interface RecentOrderVM {
  orderId: number;
  userName?: string;
  total: number;
  status: string;
  createdOn: string;
}

export interface DailyOrdersVM {
  date: string;
  ordersCount: number;
}

export interface AdminDashboardVM {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  todayOrders: number;
  recentOrders: RecentOrderVM[];
  ordersLast7Days: DailyOrdersVM[];
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {

  private baseUrl = environment.apiURL + '/api/admin';

  constructor(private http: HttpClient) {}

  // ==================================
  // IMAGE HELPER (FIXED & UNIFIED)
  // ==================================
  getImageUrl(relativePath: string | null | undefined): string {
    if (!relativePath) return 'assets/placeholder.png';

    if (relativePath.startsWith('http')) return relativePath;

    const base = environment.apiURL.replace('/api', '').replace(/\/$/, '');
    const clean = relativePath.replace(/^\/+/, '');

    return `${base}/${clean}`;
  }


  // ========= DASHBOARD =========
  getDashboardOverview() {
    return this.http.get<AdminDashboardVM>(`${this.baseUrl}/dashboard`);
  }


  // ========= PRODUCTS =========
  getProducts() {
    return this.http.get<any>(`${this.baseUrl}/products`);
  }

  createProduct(formData: FormData) {
    return this.http.post(`${this.baseUrl}/products`, formData);
  }

  updateProduct(formData: FormData) {
    return this.http.put(`${this.baseUrl}/products`, formData);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }

  increaseStock(productId: number, qty: number) {
    return this.http.put(`${this.baseUrl}/products/stock/increase`, null, {
      params: { productId, quantity: qty }
    });
  }

  decreaseStock(productId: number, qty: number) {
    return this.http.put(`${this.baseUrl}/products/stock/decrease`, null, {
      params: { productId, quantity: qty }
    });
  }


  // ========= ORDERS =========
  getOrders() {
    return this.http.get<any>(`${this.baseUrl}/orders`);
  }

  getOrderDetails(id: number) {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`);
  }

  updateOrderStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}/orders/${id}/status`, null, {
      params: { status }
    });
  }

  cancelOrder(id: number) {
    return this.http.put(`${this.baseUrl}/orders/${id}/cancel`, null);
  }


  // ========= CATEGORIES =========
  getCategories() {
    return this.http.get<any>(`${this.baseUrl}/categories`);
  }

  createCategory(formData: FormData) {
    return this.http.post(`${this.baseUrl}/categories`, formData);
  }

  updateCategory(formData: FormData) {
    return this.http.put(`${this.baseUrl}/categories`, formData);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  hardDeleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/categories/hard/${id}`);
  }


  // ========= BRANDS =========
  getBrands() {
    return this.http.get<any>(`${this.baseUrl}/brands`);
  }

  createBrand(fd: FormData) {
    return this.http.post(`${this.baseUrl}/brands`, fd);
  }

  updateBrand(fd: FormData) {
    return this.http.put(`${this.baseUrl}/brands`, fd);
  }

  deleteBrand(id: number) {
    return this.http.delete(`${this.baseUrl}/brands/${id}`);
  }


  // ========= USERS =========
  getUsers() {
    return this.http.get<any>(`${this.baseUrl}/users`);
  }

  getUser(id: string) {
    return this.http.get<any>(`${this.baseUrl}/users/${id}`);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  getUserRoles(userId: string) {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}/roles`);
  }

  updateUserRoles(userId: string, roles: string[]) {
    return this.http.put(`${this.baseUrl}/users/${userId}/roles`, {
      userId,
      roleNames: roles
    });
  }


  // ========= ROLES =========
  getRoles() {
    return this.http.get<any>(`${this.baseUrl}/roles`);
  }

  createRole(roleName: string) {
    return this.http.post(`${this.baseUrl}/roles`, { roleName });
  }

  deleteRole(roleName: string) {
    return this.http.delete(`${this.baseUrl}/roles/${roleName}`);
  }

}
