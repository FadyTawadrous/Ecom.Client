import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

// Choose one navbar to use:
import { Navbar } from '../../../shared/components/navbar/navbar';
//import { TestNavbar } from '../../../shared/components/test-navbar/test-navbar';

// Choose one footer to use:
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    CommonModule,

    // Choose navbar
    Navbar,
    //TestNavbar,

    // Choose footer
    Footer,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
