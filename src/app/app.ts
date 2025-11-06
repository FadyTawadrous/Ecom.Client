import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared-module';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  constructor(private http: HttpClient) {}

  protected readonly title = signal('Ecom.Client');

  // All this section is for testing the connection between Angular and web API
  // We will use services and signals to consume API in Angular
  private apiURL = environment.apiURL + '/weatherforecast';
  weatherData:any;

  public getWeather()
  {
    return this.weatherData = this.http.get(this.apiURL).subscribe({
      next: ((value:any) =>{
        this.weatherData = value;
        console.log(this.weatherData);
      })
    })
  }
  
  ngOnInit(): void {
    this.getWeather();
  }

}
