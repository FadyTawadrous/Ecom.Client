import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AddressService } from '../../../core/services/address-service';
import { Address } from '../../../core/models/address.models';

import { MaterialModule } from '../../../shared/material/material-module';

import { MapPickerComponent } from '../../../shared/components/map-picker-component/map-picker-component';
import { MapService } from '../../../core/services/map-service';

@Component({
  selector: 'app-address-dialog-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MapPickerComponent
  ],
  templateUrl: './address-dialog-component.html',
  styleUrl: './address-dialog-component.scss',
})
export class AddressDialogComponent {

  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private dialogRef = inject(MatDialogRef<AddressDialogComponent>);
  private mapService = inject(MapService);

  lat: number = 0;
  lng: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Address | null) {
    if (data) {
      this.isEditMode = true;
      this.addressForm.patchValue(data);
    }
  }

  isLoading = false;
  isEditMode = false;

  onLocationPicked(coords: { lat: number, lng: number }) {
    this.lat = coords.lat;
    this.lng = coords.lng;

    // Auto-fill form using Reverse Geocoding
    this.mapService.getAddressFromCoords(coords.lat, coords.lng).subscribe(data => {
      if (data && data.address) {
        this.addressForm.patchValue({
          street: data.address.road || '',
          city: data.address.city || data.address.town || data.address.village || '',
          country: data.address.country || '',
          postalCode: data.address.postcode || ''
        });
      }
    });
  }

  addressForm: FormGroup = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    postalCode: [''],
  });

  save() {
    if (this.addressForm.invalid) return;
    this.isLoading = true;

    const formValue = {
      ...this.addressForm.value,
      latitude: this.lat,
      longitude: this.lng
    };

    if (this.isEditMode && this.data) {
      // Update
      const updateData = { ...formValue, id: this.data.id };
      this.addressService.updateAddress(updateData).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isLoading = false
      });
    } else {
      // Create
      this.addressService.addAddress(formValue).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.isLoading = false
      });
    }
  }

}
