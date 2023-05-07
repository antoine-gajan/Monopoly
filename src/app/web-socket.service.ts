import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from 'enviroment/enviroment';
import { Router } from '@angular/router';
import { LoginComponent } from './user/login/login.component';


@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  localSocketID: string;
  private username: string;
  private email: string;
  private _socketID: string;
  private socket = io(environment.socketURL, { transports: ["websocket"] });

  constructor(private router: Router) {
    this.socket.on('connect', () => {
      this._socketID = this.socket.id;
      console.log('Socket conectado con ID:', this._socketID);

    });
  }

  get socketID(): string {
    return this._socketID;
  }

  getSocketID() {
    this.socket.on('connect', () => {
      console.log('Socket conectado con ID:', this.socket.id);
      // Almacenar el ID del socket en una cookie o en el almacenamiento local
      localStorage.setItem('socketID', this.socket.id);
    });
    // Obtener el valor del ID del socket desde una cookie o del almacenamiento local
    this._socketID = localStorage.getItem('socketID') || '';
    console.log('getSocketID: ', this._socketID);
    return this._socketID;
  }


  setUsername(username: string): void {
    localStorage.setItem('username', username);
    this.username = username;
  }

  setEmail(email: string): void {
    //localStorage.setItem('email', email);
    this.email = email;
  }
  getUsername(): string {
    // Get username from browser
    let username_browser = localStorage.getItem('username');
    let username_client = this.username;
    return username_browser ? username_browser : username_client;
  
  }

  getEmail(): string {
    return this.email;
  }
  //Función que recibe la información necesaria para logear un usuario
  public login(user: any): Promise<boolean> {
    console.log('login: ', user);
    this.localSocketID = user.socketID;
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
      } else if(response.cod === 1){
        console.log('CREAR CUENTA: ya existe un usuario con ese username');
        reject(false);
      } else{
        console.log('Error en el registro');
      }
    });
    
  });
    
  }

  //Función que recibe la información necesaria para cambiar el nombre de un usuario
  guardar_new_username(user: any): Promise<boolean>{
    //user.socketID = this.localSocketID;
    console.log('guardar_new_username: ', user);
    //this.socket.emit('updateUsername', user);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('updateUsername', user, (response: any) => {
      console.log('updateUsername response:', response);
      console.log('updateUsername response.cod:', response.cod);
      if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
        resolve(true);
        location.reload();
      } else{
        console.log('Error al cambiar el nombre de usuario');
        reject(false);
      }
    });
  });
  }
 
  //Función que recibe la infomación necesaria para eliminar a un usuario
  onDeleteUser(user: any){
    console.log('onDeleteUser: ', user);
    this.socket.emit('deleteUser', user, (response: any) => {
      console.log('deleteUser response:', response);
      console.log('deleteUser response.cod:', response.cod);
      if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
        this.router.navigate(['/login']);
      } else{
        console.log('Error al cambiar el nombre de usuario');
      }
    });
  }
}