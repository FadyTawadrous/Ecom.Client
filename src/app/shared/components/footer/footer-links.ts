import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-links',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer-links.html'
})
export class FooterLinks {
  @Input() type: 'company' | 'service' = 'company';

  companyLinks = [
    { label: 'About Us', url: '/about' },
    { label: 'Careers', url: '/careers' },
    { label: 'Blog', url: '/blog' },
  ];

  customerServiceLinks = [
    { label: 'Contact Us', url: '/contact' },
    { label: 'Shipping & Delivery', url: '/shipping' },
    { label: 'Returns & Refunds', url: '/refunds' },
    { label: 'Help Center', url: '/help' },
  ];
}
