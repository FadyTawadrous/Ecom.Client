import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material-module';
import { ConfirmDialog } from '../../app/shared/components/confirm-dialog/confirm-dialog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    ConfirmDialog
  ],
  exports: [
    MaterialModule,
    ConfirmDialog
  ]
})
export class SharedModule { }
