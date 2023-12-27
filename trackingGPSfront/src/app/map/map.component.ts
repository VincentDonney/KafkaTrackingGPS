import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { WebsocketService } from '../service/websocket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  public number: string = '';
  public allowMoving: boolean = false;

  constructor(private websocket: WebsocketService) {}

  ngAfterViewInit(): void {
    this.websocket.getNumber().subscribe((num: string) => {
      this.number = num;
    });
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    const pos1 = L.marker([51.5, -0.09]).addTo(this.map).bindPopup('Pos 1');

    setInterval(() => {
      if (this.allowMoving){
      const currentLatLng = pos1.getLatLng();
      pos1.setLatLng([currentLatLng.lat + 0.01, currentLatLng.lng]);

      this.map.setView([currentLatLng.lat, currentLatLng.lng]);
      }

    }, 1000);
  }

  ngOnDestroy() {
    this.map.remove();
  }
}
