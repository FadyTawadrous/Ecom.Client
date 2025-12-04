import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatCard } from "@angular/material/card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [MatIcon, MatCard, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {

  team = [
    'Fady Tawadrous',
    'Ibrahim Mohamed',
    'Govani Samy',
    'Israa Ahmed',
    'Hazem Anter',
  ];
}
