import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { WebsocketService } from '../service/websocket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  private map:any;
  public number: string ='';
  constructor(private websocket:WebsocketService){}

  ngAfterViewInit():void{
    this.websocket.getNumber().subscribe((num: string)=>{
      this.number = num;
    })
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const pos1 = L.marker([51.5, -0.09]).addTo(this.map).bindPopup('Pos 1');


    const pos2 = L.marker([51.5, -0.1]).addTo(this.map).bindPopup('Pos 2');
  }

  ngOnDestroy(){
    this.map.remove();
  }
}
