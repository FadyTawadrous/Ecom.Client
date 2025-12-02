import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AddressService } from '../../../core/services/address-service';
import { Address } from '../../../core/models/address.models';

import { MaterialModule } from '../../../shared/material/material-module';

@Component({
  selector: 'app-address-dialog-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './address-dialog-component.html',
  styleUrl: './address-dialog-component.scss',
})
export class AddressDialogComponent {

  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private dialogRef = inject(MatDialogRef<AddressDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Address | null) {
    if (data) {
      this.isEditMode = true;
      this.addressForm.patchValue(data);
    }
  }

  isLoading = false;
  isEditMode = false;

  addressForm: FormGroup = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    postalCode: ['']
  });

  save() {
    if (this.addressForm.invalid) return;
    this.isLoading = true;

    const formValue = this.addressForm.value;

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
