import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule, WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MaterialModule } from '../../material/material-module';

@Component({
  selector: 'app-face-capture-component',
  imports: [CommonModule, WebcamModule, MaterialModule],
  templateUrl: './face-capture-component.html',
  styleUrl: './face-capture-component.scss',
})
export class FaceCaptureComponent {

  private dialogRef = inject(MatDialogRef<FaceCaptureComponent>);

  // Webcam trigger
  private trigger = new Subject<void>();
  capturedImage = signal<WebcamImage | null>(null);
  errorMsg = signal<string>('');

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.capturedImage.set(webcamImage);
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      this.errorMsg.set("Camera access denied. Please allow camera permissions.");
    } else {
      this.errorMsg.set("Could not access camera.");
    }
  }

  retake() {
    this.capturedImage.set(null);
  }

  confirm() {
    if (this.capturedImage()) {
      // Convert Base64 to File
      const file = this.dataURItoBlob(this.capturedImage()!.imageAsDataUrl);
      this.dialogRef.close(file);
    }
  }

  // Helper to convert Base64 DataURL to Blob/File
  private dataURItoBlob(dataURI: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], "face-capture.jpg", { type: mimeString });
  }

}
