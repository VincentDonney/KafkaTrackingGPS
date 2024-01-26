import { Component, AfterViewInit, makeStateKey } from '@angular/core';
import * as L from 'leaflet';
import { WebsocketService } from '../service/websocket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private pos1 = L.circleMarker([0, 0], {
    color: 'blue',
    fillColor: 'blue',
    fillOpacity: 1,
    radius: 7,
  });
  private pos2 = L.circleMarker([0, 0], {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 1,
    radius: 7,
  });
  private focusToggled1: boolean = false;
  private trail1: any[] = [];
  private trailPolyline1 : any;
  private focusToggled2: boolean = false;
  private trail2: any[] = [];
  private trailPolyline2 : any;

  constructor(private websocket: WebsocketService) {}

  ngAfterViewInit(): void {
    this.websocket.connect();
    console.log("bb");
    this.websocket.getMessages()?.subscribe((message: any)=> {
      let coords1 = {lat:message[0]['x'], lng:message[0]['y']};
      let coords2 = {lat: message[1]['x'], lng: message[1]['y']};
      console.log(coords1);
      console.log(coords2);
      console.log("aaa");
      this.updateCoords(coords1,coords2);
    })
    console.log("ccc");
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([0, 0], 18).on('click', () => {
      this.focusToggled1 = false;
      this.focusToggled2 = false;
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  
    this.pos1.addTo(this.map).on('click', ( () => {
      this.focusToggled1 = true;
      this.focusToggled2 = false;
    })).bindPopup('Pos 1');

    this.pos2.addTo(this.map).on('click', ( () => {
      this.focusToggled2 = true;
      this.focusToggled1 = false;
    })).bindPopup('Pos 2');

    const currentLatLng1 = this.pos1.getLatLng();
    var display: string = "Pos 1, Lng:"+currentLatLng1.lng+" Lat: "+currentLatLng1.lat;
    this.pos1.setPopupContent(display);

    const currentLatLng2 = this.pos2.getLatLng();
    display = "Pos 2, Lng:"+currentLatLng2.lng+" Lat: "+currentLatLng2.lat;
    this.pos2.setPopupContent(display);

    this.trailPolyline1 = L.polyline([], {
      color: 'blue',
      weight: 4,
      opacity: 0.8,
      lineJoin: 'round',
      dashArray: '5, 10',
    });
    this.trailPolyline1.addTo(this.map);

    this.trailPolyline2 = L.polyline([], {
      color: 'red',
      weight: 4,
      opacity: 0.8,
      lineJoin: 'round',
      dashArray: '5, 10',
    });
    this.trailPolyline2.addTo(this.map);
  }

  updateCoords(coords1: L.LatLngLiteral,coords2: L.LatLngLiteral){
    this.pos1.setLatLng(coords1);
    this.pos2.setLatLng(coords2);
    const currentLatLng1 = this.pos1.getLatLng();
    const currentLatLng2 = this.pos2.getLatLng();

    var display: string = "Pos 1, Lng:"+currentLatLng1.lng+" Lat: "+currentLatLng1.lat;
    this.pos1.setPopupContent(display);
    this.trail1.push([currentLatLng1.lat, currentLatLng1.lng]);
    if (this.trail1.length > 40000) {
      this.trail1.shift();
    }    
    this.trailPolyline1.setLatLngs(this.trail1);
    this.pos1.bringToFront();
    if (this.focusToggled1)
          this.map.setView([currentLatLng1.lat, currentLatLng1.lng]);

    display="Pos 2, Lng:"+currentLatLng2.lng+" Lat: "+currentLatLng2.lat;
    this.pos2.setPopupContent(display);
    this.trail2.push([currentLatLng2.lat, currentLatLng2.lng]);
    if (this.trail2.length > 40000) {
      this.trail2.shift();
    }    
    this.trailPolyline2.setLatLngs(this.trail2);
    this.pos2.bringToFront();
    if (this.focusToggled2)
      this.map.setView([currentLatLng2.lat, currentLatLng2.lng]);
  }
  
  ngOnDestroy() {
    this.map.remove();
  }
}
