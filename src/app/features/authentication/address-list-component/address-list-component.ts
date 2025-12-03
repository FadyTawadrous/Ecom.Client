import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressService } from '../../../core/services/address-service';
import { AddressDialogComponent } from '../address-dialog-component/address-dialog-component';
import { Address } from '../../../core/models/address.models';

import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material/material-module';

@Component({
  selector: 'app-address-list-component',
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './address-list-component.html',
  styleUrl: './address-list-component.scss',
})
export class AddressListComponent {

  addressService = inject(AddressService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.addressService.loadUserAddresses();
  }

  openDialog(address?: Address) {
    this.dialog.open(AddressDialogComponent, {
      width: '400px',
      disableClose: true,
      data: address || null
    });
  }

  deleteAddress(id: number) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(id).subscribe();
    }
  }

}
