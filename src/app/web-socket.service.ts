import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { environment } from 'enviroment/enviroment';
import { Router } from '@angular/router';
import { LoginComponent } from './user/login/login.component';

                                                                                                                                           
@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
                                   
  //private socket = io(environment.socketURL,{ transports: ["websocket"] });
  private socket;
  private username: string;
  private email: string;
  public socketID: string;
  constructor(
    private router: Router
  ) {
    const storedSocketId = localStorage.getItem('socketId');
    if (storedSocketId) {
      this.socketID = storedSocketId;
      this.socket = io(environment.socketURL, {
        query: {
          socketId: this.socketID
        },
        transports: ["websocket"]
      });
    } else {
      this.socket = io(environment.socketURL, {
        transports: ["websocket"]
      });
      this.socket.on('connect', () => {
        this.socketID = this.socket.id;
        localStorage.setItem('socketId', this.socketID);
      });
    }

  }
  connect() {
    this.socket = io(environment.socketURL, { transports: ["websocket"] });
    this.socket.on('connect', () => {
      this.socketID = this.socket.id;
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
  //Función para obtener el username
  setUsername(username: string): string {
    localStorage.setItem('username', username);
    return this.username;
  }

  getUsername(): string {
    // Get username from browser
    let username_browser = localStorage.getItem('username');
    let username_client = this.username;
    return username_browser ? username_browser : username_client;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  //Función que recibe la información necesaria para logear un usuario
  public login(user: any/*username: string, nuevo_password: string*/): Promise<boolean> {
    //this.valorConstante = this.getSocketID();
    
    //const user = {username: username, password: nuevo_password, socketId: this.getSocketID()};
    console.log('login: ', user);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('login', user, (response: any) => {
        console.log('Login response:', response);
        console.log('Login response.cod:', response.cod);
        if (response.cod === 0) {
          this.setUsername(user.username);
          localStorage.setItem('socketID', this.socket.id); // almacenar el socketID en el almacenamiento local
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
    //const user = { username: username, email: email, password: nuevo_password, confirm_password: nuevo_confirm_password, socketId: this.getSocketID()};
    console.log('registro: ', user);
    //this.socket.emit('registro', user);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('register', user, (response: any) => {
      console.log('Registro response:', response);
      console.log('Registro response.cod:', response.cod);
      if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
        this.setUsername(user.username);
        this.router.navigate(['/pantalla']);
        resolve(true);
      } else{
        console.log('CREAR CUENTA: ya existe un usuario con ese username');
        reject(false);
      }
    });
    
  });
  
    
  }

  //Función que recibe la información necesaria para cambiar el nombre de un usuario
  guardar_new_username(old_username:string, new_username:string): Promise<boolean>{
    //this.valorSocket = this.getSocketID();
    const username_change = {
      username: old_username,
      newusername: new_username,
      socketId: this.socket  
    };
    console.log('guardar_new_username: ', username_change);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('updateUsername', username_change, (response: any) => {
        console.log('updateUsername response:', response);
        if (response && response.cod === 0) { // Comprueba que haya una respuesta y que el código de confirmación sea 0
          console.log('updateUsername response.cod:', response.cod);
          this.setUsername(username_change.newusername);
          resolve(true);
          location.reload();
        } else {
          console.log('Error al cambiar el nombre de usuario');
          reject(false);
        }
      });
    });
  }
  
 
}