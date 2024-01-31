import { Component, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import { WebsocketService } from '../service/websocket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private numPoints:number = 0;
  private map: any;
  private markers:L.Marker[] = [];
  private trails: any[][] = [];
  private polylines:L.Polyline[] = [];
  private focus = new Array(5).fill(false);
  constructor(private websocket: WebsocketService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.websocket.connect();
    this.websocket.getMessages()?.subscribe((message: any)=> {
      console.log(message);
      if(message!==undefined && Object.keys(message).length!=0){
        var coords:L.LatLngLiteral[] = [];
        for (let i = 1; i < 6; i++){
          coords.push({lat:message[i.toString()]['x'], lng:message[i.toString()]['y']});
        }
        this.updateCoords(coords);
      }
    })
  }

  initMap(): void {
    const imgFolderPath = "assets/img";
    const files = [
      "fatalis.png",
      "malzeno.png",
      "shagaru.png",
      "rathalos.png",
      "vaalstrax.png"
    ];
    const colors = ['black', 'red', 'green', 'orange', 'purple'];
    const defaultPos = [
      [49.43742987885597,11.090147027822049],
      [45.74505320159049,4.8542187705193],
      [43.31945855038965,-0.3604954584934873],
      [53.331037208428306,-6.278139264804377 ],
      [48.636780,-1.511305]
    ];
    this.map = L.map('map').setView([47, 7], 5).on('click', () => {
      this.focus.fill(false);
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 3
    }).addTo(this.map);

    var i = 0;
    files.forEach(file => {
      //Create an icon
      const icon = L.icon({
        iconUrl:imgFolderPath+"/"+file,
        iconSize:[50,50],
        iconAnchor:[25,25]
      })
      //Create a marker with this icon
      var marker = L.marker([defaultPos[i][0],defaultPos[i][1]],{
        icon:icon
      });
      marker.addTo(this.map).on('click', ( () => {
        this.focus.fill(false);
        this.focus[i] = true;
      })).bindPopup("Pos "+i);
      const currentLatLng = marker.getLatLng();
      marker.setPopupContent("Pos "+(i+1)+" , Lng: "+currentLatLng.lng+" Lat: "+currentLatLng.lat);
      this.markers.push(marker);

      //Create trail and polyline
      var polyline = L.polyline([],{
        color:colors[i],
        weight: 4,
        opacity: 0.8,
        lineJoin: 'round',
        dashArray: '5, 10',
      }).addTo(this.map);
      this.polylines.push(polyline);
      this.trails.push([]);

      i++;
    });
    
  }

  updateCoords(coords: L.LatLngLiteral[]){
    for (let i = 0; i < 5; i++){
      this.markers[i].setLatLng(coords[i]);
      const currentLatLng = this.markers[i].getLatLng();
      this.markers[i].setPopupContent("Pos " + i+1 +", Lng:"+currentLatLng.lng+" Lat: "+currentLatLng.lat);
      this.trails[i].push([currentLatLng.lat,currentLatLng.lng]);
      if (this.trails[i].length > 40000) {
        this.trails[i].shift();
      }   
      this.polylines[i].setLatLngs(this.trails[i]);
      if (this.focus[i])
          this.map.setView([currentLatLng.lat, currentLatLng.lng]);
    }
  }

  changeView(){
    const ostFolder = "assets/ost"
    this.focus.fill(false);
    this.focus[this.numPoints] = true;
    this.map.setView(this.markers[this.numPoints].getLatLng(),17);
    this.numPoints = (this.numPoints + 1) % 5;
  }  

  resetZoom(){
    this.focus.fill(false);
    this.map.setView([47, 7], 5);
  }

  ngOnDestroy() {
    this.map.remove();
  }
}
