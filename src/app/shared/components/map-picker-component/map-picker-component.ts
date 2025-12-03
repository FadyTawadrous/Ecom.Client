import { Component, EventEmitter, Output, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet'; // Import Leaflet

@Component({
  selector: 'app-map-picker-component',
  imports: [CommonModule],
  templateUrl: './map-picker-component.html',
  styleUrl: './map-picker-component.scss',
})
export class MapPickerComponent implements AfterViewInit {

  @Output() locationPicked = new EventEmitter<{ lat: number, lng: number }>();

  private map!: L.Map;
  private marker!: L.Marker;

  // Default: Cairo Center
  private defaultLat = 30.0444;
  private defaultLng = 31.2357;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    // Leaflet requires the "window" object, so we check if we are in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  private initMap(): void {
    // 1. Initialize Map
    this.map = L.map('map').setView([this.defaultLat, this.defaultLng], 13);

    // 2. Add Tile Layer (The visual map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // 3. Fix default marker icon issues in Webpack/Angular
    this.fixLeafletIcons();

    // 4. Add Draggable Marker
    this.marker = L.marker([this.defaultLat, this.defaultLng], { draggable: true })
      .addTo(this.map);

    // 5. Listen for Drag End
    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.locationPicked.emit({ lat: position.lat, lng: position.lng });
    });

    // 6. Click map to move marker
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
      this.locationPicked.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    // 7. Try to get real User Location
    this.locateUser();
  }

  private locateUser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.map.setView([lat, lng], 15);
        this.marker.setLatLng([lat, lng]);
        this.locationPicked.emit({ lat, lng }); // Emit initial location
      });
    }
  }

  private fixLeafletIcons() {
    // Leaflet's default icon paths break in Angular builds. This fixes it.
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';

    // You need to copy these images from node_modules/leaflet/dist/images to src/assets
    // OR use CDN links like below for quick setup:
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    L.Marker.prototype.options.icon = DefaultIcon;
  }

}
