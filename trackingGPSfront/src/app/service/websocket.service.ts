import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject} from 'rxjs/webSocket'

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> | null = null

  public connect():void {
    this.socket$ = webSocket('ws://localhost:8000/ws');
  }

  public getMessages() {
    return this.socket$?.asObservable();
  }

}
