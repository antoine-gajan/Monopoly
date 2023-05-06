import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from 'enviroment/enviroment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class WebSocketService {

  socket = io(environment.socketURL,{ transports: ["websocket"] });
  constructor(
    private router: Router
  ) {}

  getSocketID() {
    return this.socket.id;
  }

  public login(user: any) {
    console.log('login: ', user);
    this.socket.emit('login', user);
      //this.router.navigate(['/pantalla_usuario'])
  }

  //Función que recibe la información necesaria para registrar un usuario
  public registro(user: any) {
    console.log('registro: ', user);
    this.socket.emit('registro', user);
  }
}