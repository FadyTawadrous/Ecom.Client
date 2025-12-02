import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {

  private http = inject(HttpClient);

  // Free API from OpenStreetMap (No key needed for low usage)
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse?format=json';

  getAddressFromCoords(lat: number, lng: number): Observable<any> {
    return this.http.get<any>(`${this.NOMINATIM_URL}&lat=${lat}&lon=${lng}`).pipe(
      map(response => {
        // Extract useful parts
        return {
          displayName: response.display_name,
          address: response.address // Contains city, road, etc.
        };
      })
    );
  }

}
