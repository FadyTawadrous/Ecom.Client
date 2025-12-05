import { Component } from '@angular/core';
import * as emailjs from '@emailjs/browser';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  templateUrl: './contact.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class Contact {
  
  model = {
    name: '',
    email: '',
    message: ''
  };

  sending = false;

  constructor() {
    emailjs.init('4KvX9BomaMpd0LoNR');   // ✅ PUBLIC KEY
  }

  submit() {
    this.sending = true;

    emailjs.send(
      'service_f26rmbe',
      'template_7slsexh',
      {
        user_name: this.model.name,
        user_email: this.model.email,
        message: this.model.message
      },
      '4KvX9BomaMpd0LoNR'
    )
    .then(() => {
      alert('✅ Message sent successfully!');
      this.model = { name: '', email: '', message: '' };
      this.sending = false;
    })
    .catch((error: any) => {
      console.error(error.text || error);
      alert(error.text || '❌ Failed to send message');
      this.sending = false;
    });
  }
}
