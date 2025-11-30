import { Component } from '@angular/core';
import { FooterLinks } from './footer-links';
import { FooterSocial } from './footer-social';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FooterLinks, FooterSocial],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class Footer {}
