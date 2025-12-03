import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-social',
  standalone: true,
  templateUrl: './footer-social.html'
})
export class FooterSocial {
  socialLinks = [
    { icon: 'facebook', url: 'https://facebook.com', label: 'Facebook' },
    { icon: 'photo_camera', url: 'https://instagram.com', label: 'Instagram' },
    { icon: 'play_circle', url: 'https://youtube.com', label: 'YouTube'  }
  ];
}
