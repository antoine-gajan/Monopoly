import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from 'enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {

  socket = io(environment.socketURL,{ transports: ["websocket"] });

  public login(user: any) {
    console.log('login: ', user);
    this.socket.emit('login', user);
  }

}
