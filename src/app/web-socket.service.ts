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
    this.socket.on('connect', () => {
      console.log('Socket conectado con ID:', this.socket.id);
    });
    console.log('getSocketID: ', this.socket.id);
    return this.socket.id;
  }
  public login(user: any) {
    console.log('login: ', user);
    this.socket.emit('login', user, (response: any) => {
      console.log('Login response:', response);
      if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
        this.router.navigate(['/pantalla']);
      }
    });
  }
  

  //Función que recibe la información necesaria para registrar un usuario
  public registro(user: any) {
    console.log('registro: ', user);
    this.socket.emit('registro', user);
  }
}