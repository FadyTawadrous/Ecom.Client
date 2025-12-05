import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
title = signal("my first Angular App");
message = input("Hello Hello!");
}
