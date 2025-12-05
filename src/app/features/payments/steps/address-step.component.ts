import { Component, Input, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { MaterialModule } from '../../../shared/material/material-module';

import { Address } from '../../../core/models/address.models';
import { AddressService } from '../../../core/services/address-service';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from '../../authentication/address-dialog-component/address-dialog-component';
import { PaymentService } from '../payments.service';

@Component({
  standalone: true,
  selector: 'app-address-step',
  imports: [CommonModule, MaterialModule],
  templateUrl: './address-step.component.html',
  styleUrls: ['./address-step.component.scss'],
})
export class AddressStepComponent implements OnInit {

  @Input() stepper!: MatStepper;

  private addressService = inject(AddressService);
  private dialog = inject(MatDialog);
  private paymentService = inject(PaymentService);

  // Bind directly to service state
  addresses = this.addressService.addresses;

  selectedAddressId = signal<number | null>(null);

  ngOnInit() {
    // Load current addresses
    this.addressService.loadUserAddresses();

    // Auto-update UI when the service updates
    // effect(() => {
    //   this.addresses(); // reactive trigger
    // });
  }

  openDialog(address?: Address) {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '400px',
      disableClose: true,
      data: address || null,
    });

    // Refresh addresses AFTER dialog closes
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addressService.loadUserAddresses();
      }
    });
  }

  chooseAddress(addr: Address) {
    this.selectedAddressId.set(addr.id);
    this.paymentService.saveAddress(addr);
  }

  deleteAddress(id: number) {
    if (!confirm('Delete this address?')) return;

    this.addressService.deleteAddress(id).subscribe(() => {
      if (this.selectedAddressId() === id) {
        this.selectedAddressId.set(null);
      }
      // Reload updated list
      this.addressService.loadUserAddresses();
    });
  }

  continue() {
    const id = this.selectedAddressId();
    if (!id) return;

    const addr = this.addresses().find(a => a.id === id);
    if (addr) this.paymentService.saveAddress(addr);

    this.stepper.next();
  }
}
