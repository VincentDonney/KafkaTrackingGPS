import { Component, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import { WebsocketService } from '../service/websocket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  // used to switch between markers
  private numPoints:number = 0;

  // map object from leaflet
  private map: any;

  // list of markers from leaflet
  private markers:L.Marker[] = [];

  // records the previous coordinates of every marker to create a trail for each one of them
  private trails: any[][] = [];

  // list of leaflet polyline objects used to represent the trails
  private polylines:L.Polyline[] = [];

  // list of booleans used to activate focus on a specific marker
  private focus = new Array(5).fill(false);


  constructor(private websocket: WebsocketService) {}

  ngAfterViewInit(): void {
    // calls initMap() to create a leaflet map object, leaflet markers, their trails and polylines
    this.initMap();
    // connect to the websocket to receive messages from Kafka
    this.websocket.connect();
    // wait for new messages and update coordinates of the markers
    this.websocket.getMessages()?.subscribe((message: any)=> {
      console.log(message);
      if(message!==undefined && Object.keys(message).length!=0){
        // creates empty list to receive the coordinates of the markers
        var coords:L.LatLngLiteral[] = [];
        for (let i = 1; i < 6; i++){
          // add the coordinates received from Kafka to our list
          coords.push({lat:message[i.toString()]['x'], lng:message[i.toString()]['y']});
        }
        // update the position of every marker with the new coordinates that we have
        this.updateCoords(coords);
      }
    })
  }

  // initialize the different leaflet objects (map, markers, trails, polylines) and their events
  initMap(): void {
    // retrieves images from the assets folder
    const imgFolderPath = "assets/img";
    const files = [
      "fatalis.png",
      "malzeno.png",
      "shagaru.png",
      "rathalos.png",
      "vaalstrax.png"
    ];

    // colors used to customize each polyline object
    const colors = ['black', 'red', 'green', 'orange', 'purple'];

    // the initial positions of every marker (so they are created at their initial position instantly, without having to wait for Kafka at the start)
    const defaultPos = [
      [49.43742987885597,11.090147027822049],
      [45.74505320159049,4.8542187705193],
      [43.31945855038965,-0.3604954584934873],
      [53.331037208428306,-6.278139264804377 ],
      [48.636780,-1.511305]
    ];
    // sets the default position and zoom of the map, so it can display every marker at the start
    this.map = L.map('map').setView([47, 7], 5).on('click', () => {
      this.focus.fill(false);
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 3
    }).addTo(this.map);

    var i = 0;
    // creates an icon for each marker using the images stored inside the assets folder
    files.forEach(file => {
      const icon = L.icon({
        iconUrl:imgFolderPath+"/"+file,
        iconSize:[50,50],
        iconAnchor:[25,25]
      })
      // creates a marker with this icon
      var marker = L.marker([defaultPos[i][0],defaultPos[i][1]],{
        icon:icon
      });

      // adds the marker to the map
      marker.addTo(this.map).on('click', ( () => {
        this.focus.fill(false);
        this.focus[i] = true;
      })).bindPopup("Pos "+i);
      const currentLatLng = marker.getLatLng();
      // displays the coordinates of the marker on its popup
      marker.setPopupContent("Pos "+(i+1)+" , Lng: "+currentLatLng.lng+" Lat: "+currentLatLng.lat);
      this.markers.push(marker);

      // creates the trail and polyline with the specific color
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

  // updates the coordinates of every marker after we received a messages from Kafka
  // also updates the trails and polylines of each marker
  updateCoords(coords: L.LatLngLiteral[]){

    for (let i = 0; i < 5; i++){
      // moves the marker to its new position
      this.markers[i].setLatLng(coords[i]);
      // changes the display of the popup to the new coordinates
      this.markers[i].setPopupContent("Pos " + i+1 +", Lng:"+coords[i].lng+" Lat: "+coords[i].lat);
      // adds the new coordinates to the trail of the marker
      this.trails[i].push([coords[i].lat,coords[i].lng]);
      // if the trail has reached its maximum length, the oldest position is replaced and the new position is added at the end
      if (this.trails[i].length > 40000) {
        this.trails[i].shift();
      }   
      // updates the polyline with the new position of the trail
      this.polylines[i].setLatLngs(this.trails[i]);
      // sets the view of the map on the marker  when focus is activated
      if (this.focus[i])
          this.map.setView([coords[i].lat, coords[i].lng]);
    }
  }

  // sets the view of the map on the marker and switch the value of numPoints to the next marker for the next call
  changeView(){
    const ostFolder = "assets/ost"
    // removes any focus activated
    this.focus.fill(false);
    // the maps gets centered on the marker corresponding to numPoints
    this.focus[this.numPoints] = true;
    this.map.setView(this.markers[this.numPoints].getLatLng(),17);
    // changes the value of numPoints to select the next marker for the next call of this function
    this.numPoints = (this.numPoints + 1) % 5;
  }  

  // resets the view of the map to it's initial parameters of zoom and position
  resetZoom(){
    this.focus.fill(false);
    this.map.setView([47, 7], 5);
  }

  ngOnDestroy() {
    this.map.remove();
  }
}
