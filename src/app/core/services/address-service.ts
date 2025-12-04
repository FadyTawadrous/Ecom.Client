import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api-service';
import { AuthService } from './auth-service';
import { Address, CreateAddressReq, UpdateAddressReq } from '../models/address.models';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})

export class AddressService {

  private api = inject(ApiService);
  private authService = inject(AuthService); // We need this to get the User ID
  private snackBar = inject(MatSnackBar);

  // State Management
  private addressesSignal = signal<Address[]>([]);
  readonly addresses = this.addressesSignal.asReadonly();

  loadUserAddresses() {
    const user = this.authService.currentUser();
    if (!user) return;

    // Matches Controller: [HttpGet("Users/{userId}/Addresses")]
    // Base URL is 'Address', so we append the rest
    this.api.get<Address[]>(`api/Address/Users/${user.id}/Addresses`).subscribe({
      next: (data) => this.addressesSignal.set(data),
      error: () => console.error('Failed to load addresses')
    });
  }

  addAddress(data: CreateAddressReq): Observable<any> {
    // Matches Controller: [HttpPost("Addresses")]
    console.log('Adding address:', data);
    return this.api.post('api/Address/Addresses', data).pipe(
      tap(() => {
        this.snackBar.open('Address added successfully', 'Close', { duration: 3000 });
        this.loadUserAddresses(); // Reload list
      })
    );
  }

  updateAddress(data: UpdateAddressReq): Observable<any> {
    // Matches Controller: [HttpPut("Addresses/{id}")]
    return this.api.put(`api/Address/Addresses/${data.id}`, data).pipe(
      tap(() => {
        this.snackBar.open('Address updated successfully', 'Close', { duration: 3000 });
        this.loadUserAddresses();
      })
    );
  }

  deleteAddress(id: number): Observable<any> {
    // Matches Controller: [HttpDelete("Addresses/{id}")]
    return this.api.delete(`api/Address/Addresses/${id}`).pipe(
      tap(() => {
        // Optimistic update
        this.addressesSignal.update(list => list.filter(a => a.id !== id));
        this.snackBar.open('Address removed', 'Close', { duration: 3000 });
      })
    );
  }

}
