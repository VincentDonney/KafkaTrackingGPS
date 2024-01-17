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
  private focusToggled1: boolean = false;
  private trail1: any[] = [];
  private trailPolyline1 : any;
  private pos2: any;
  private focusToggled2: boolean = false;
  private trail2: any[] = [];
  private trailPolyline2 : any;

  constructor(private websocket: WebsocketService) {}

  ngAfterViewInit(): void {
    this.websocket.getNumber().subscribe((num: string) => {
      this.number = num;
    });
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 18).on('click', () => {
      this.focusToggled1 = false;
      this.focusToggled2 = false;
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  
    this.pos1 = L.circleMarker([51.5, -0.09], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 1,
      radius: 10,
    }).addTo(this.map).on('click', ( () => {
      this.focusToggled1 = true;
      this.focusToggled2 = false;
    })
    ).bindPopup("Pos 1");

    const currentLatLng1 = this.pos1.getLatLng();
    var display: string = "Pos 1, Lng:"+currentLatLng1.lng+" Lat: "+currentLatLng1.lat;
    this.pos1.setPopupContent(display);

    

    this.trailPolyline1 = L.polyline([], {
      color: 'gray',
      weight: 4,
      opacity: 0.8,
      lineJoin: 'round',
      dashArray: '5, 10',
    });
  
    this.trailPolyline1.addTo(this.map);

    this.pos2 = L.circleMarker([51.504, -0.08], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 1,
      radius: 10,
    }).addTo(this.map).on('click', ( () => {
      this.focusToggled2 = true;
      this.focusToggled1 = false;
    })
    ).bindPopup("Pos 2");

    const currentLatLng2 = this.pos2.getLatLng();
    display = "Pos 2, Lng:"+currentLatLng2.lng+" Lat: "+currentLatLng2.lat;
    this.pos2.setPopupContent(display);

    

    this.trailPolyline2 = L.polyline([], {
      color: 'gray',
      weight: 4,
      opacity: 0.8,
      lineJoin: 'round',
      dashArray: '5, 10',
    });
  
    this.trailPolyline2.addTo(this.map);
  
    setInterval(() => {
      if (this.markerMoving) {
        const currentLatLng1 = this.pos1.getLatLng();
        this.pos1.setLatLng([currentLatLng1.lat + 0.00001, currentLatLng1.lng+ 0.00001]);
        var display: string = "Pos 1, Lng:"+currentLatLng1.lng+" Lat: "+currentLatLng1.lat;
        this.pos1.setPopupContent(display);
    
        this.trail1.push([currentLatLng1.lat + 0.00001, currentLatLng1.lng]);
        if (this.trail1.length > 40000) {
          this.trail1.shift();
        }    
        this.trailPolyline1.setLatLngs(this.trail1);
        
        this.pos1.bringToFront();
        
        if (this.focusToggled1)
          this.map.setView([currentLatLng1.lat, currentLatLng1.lng]);


        const currentLatLng2 = this.pos2.getLatLng();
        this.pos2.setLatLng([currentLatLng2.lat + 0.00001, currentLatLng2.lng+ 0.00001]);
        var display: string = "Pos 2, Lng:"+currentLatLng2.lng+" Lat: "+currentLatLng2.lat;
        this.pos2.setPopupContent(display);
    
        this.trail2.push([currentLatLng2.lat + 0.00001, currentLatLng2.lng]);
        if (this.trail2.length > 40000) {
          this.trail2.shift();
        }    
        this.trailPolyline2.setLatLngs(this.trail2);
        
        this.pos2.bringToFront();
        
        if (this.focusToggled2)
          this.map.setView([currentLatLng2.lat, currentLatLng2.lng]);
      }
    }, 300);
  }
  

  toggleMarkerMovement(): void {
    this.markerMoving = !this.markerMoving;
  }

  ngOnDestroy() {
    this.map.remove();
  }

  
}
