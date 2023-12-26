import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  constructor(private socket: Socket) {}

  getNumber(){
    return this.socket.fromEvent<string>('message');
  }
}
