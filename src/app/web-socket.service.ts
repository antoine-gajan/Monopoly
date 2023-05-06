import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from 'enviroment/enviroment';
import { Router } from '@angular/router';
import { LoginComponent } from './user/login/login.component';


@Injectable({
  providedIn: 'root'
})

export class WebSocketService {

  socket = io(environment.socketURL,{ transports: ["websocket"] });
  
  constructor(
    private router: Router
  ) {
    //this.socket = io(environment.socketURL);
    //console.log('Socket conectado con ID:', this.socket.id);
  }

  getSocketID() {
    this.socket.on('connect', () => {
      console.log('Socket conectado con ID:', this.socket.id);
    });
    console.log('getSocketID: ', this.socket.id);
    return this.socket.id;
  }

  //Función que recibe la información necesaria para logear un usuario
  public login(user: any): Promise<boolean> {
    console.log('login: ', user);
    return new Promise<boolean>((resolve, reject) => {
        this.socket.emit('login', user, (response: any) => {
        console.log('Login response:', response);
        console.log('Login response.cod:', response.cod);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          this.router.navigate(['/pantalla']);
          resolve(true);
        } else{
          console.log('Error en el login, usuario o contraseña incorrectos');
          reject(false);
        }
      });
      
    });

  }

  //Función que recibe la información necesaria para registrar un usuario
  public registro(user: any): Promise<boolean>{
    console.log('registro: ', user);
    //this.socket.emit('registro', user);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('register', user, (response: any) => {
      console.log('Registro response:', response);
      console.log('Registro response.cod:', response.cod);
      if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
        this.router.navigate(['/pantalla']);
        resolve(true);
      } else{
        console.log('CREAR CUENTA: ya existe un usuario con ese username');
        reject(false);
      }
    });
    
  });
    
  }
}