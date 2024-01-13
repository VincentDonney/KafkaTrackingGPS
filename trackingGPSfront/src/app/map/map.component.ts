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
  private markerMoving: boolean = false;
  public number: string = '';
  private pos1: any;
  private trail: any[] = [];
  private trailPolyline : any;

  constructor(private websocket: WebsocketService) {}

  ngAfterViewInit(): void {
    this.websocket.connect();
    this.websocket.getMessages()?.subscribe((message: any)=> {
      this.number = message;
    })
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);
  
    this.pos1 = L.circleMarker([51.5, -0.09], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 1,
      radius: 10,
    }).addTo(this.map).bindPopup('Pos 1');
  
    this.trailPolyline = L.polyline([], {
      color: 'gray',
      weight: 4,
      opacity: 0.8,
      lineJoin: 'round',
      dashArray: '5, 10',
    });
  
    this.trailPolyline.addTo(this.map);
  
    setInterval(() => {
      if (this.markerMoving) {
        const currentLatLng = this.pos1.getLatLng();
        this.pos1.setLatLng([currentLatLng.lat + 0.001, currentLatLng.lng]);
    
        this.trail.push([currentLatLng.lat + 0.001, currentLatLng.lng]);
        if (this.trail.length > 400) {
          this.trail.shift();
        }    
        this.trailPolyline.setLatLngs(this.trail);
        
        this.pos1.bringToFront();

        this.map.setView([currentLatLng.lat, currentLatLng.lng]);
      }
    }, 100);
  }
  

  toggleMarkerMovement(): void {
    this.markerMoving = !this.markerMoving;
  }

  ngOnDestroy() {
    this.map.remove();
  }
}
