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
    localStorage.setItem('socketID', this.socket.id);
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
    localStorage.setItem('email', email);
    this.email = email;
  }

  getUsername(): string {
    // Get username from browser
    let username_browser = localStorage.getItem('username');
    let username_client = this.username;
    return username_browser ? username_browser : username_client;
  }

  getEmail(): string {
    let email_browser = localStorage.getItem('email');
    let email_client = this.email;
    return email_browser ? email_browser : email_client;
  }

  leerEmail(user: any): Promise<string> {
    console.log("LEER EMAIL");
    return new Promise<string>((resolve, reject) => {
      this.socket.emit('infoUsuario', user, (response: any) => {
        console.log('infoUsuario response:', response);
        console.log('infoUsuario response.cod:', response.cod);
        if (response.cod === 0) {
          console.log('Correo:', response.msg.correo);
          resolve(response.msg.correo);
        } else {
          console.log('Error al obtener la información del usuario');
          reject(false);
        }
      });
    });
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
        //location.reload();
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
  
  crearSalaInvitado(user: any): Promise<boolean>{
    //const user = {username: nombreUserInivtado, socketId: this.localSocketID};
    console.log('crearSalaInvitado: ', user);
    return new Promise<boolean>((resolve, reject) => {
        this.socket.emit('nombreInvitado', user, (response: any) => {
        console.log('unirse sala invitado: ', response);
        console.log('unirse sala invitado: ', response.cod);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          this.router.navigate(['/crear_sala']);
          resolve(true);
        } else{
          console.log('al crear la sala invitado');
          reject(false);
        }
      });
      
    });
  }

  public guardar_cambio_password(user: any): Promise<boolean> {
    console.log('guardar_cambio_password: ', user);
    this.localSocketID = user.socketID;
    return new Promise<boolean>((resolve, reject) => {
        this.socket.emit('updatePassword', user, (response: any) => {
        console.log('guardar_cambio_password response:', response);
        console.log('guardar_cambio_password  response.cod:', response.cod);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          //location.reload();
          resolve(true);
        } else{
          console.log('Error en el login, usuario o contraseña incorrectos');
          reject(false);
        }
      });
      
    });

  }

  public guardar_nuevo_correo(user: any): Promise<boolean> {
    console.log('guardar cambio email: ', user);
    this.localSocketID = user.socketID;
    return new Promise<boolean>((resolve, reject) => {
        this.socket.emit('updateCorreo', user, (response: any) => {
        console.log('guardar cambio email response:', response);
        console.log('guardar cambio email  response.cod:', response.cod);
        console.log('guardar cambio email  response.msg:', response.msg);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          
          resolve(true);
        } else{
          console.log('Error al hacer un update del correo');
          reject(false);
        }
      });
    });
  }

  public crearSala(user: any){
    console.log("CREAR PARTIDA-SALA", user);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('crearPartida', user, (response: any) => {
        console.log('crearPartida response:', response);
        console.log('crearPartida response.cod:', response.cod);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          //this.router.navigate(['/crear_sala']);
          resolve(true);
          let idPartida = '';
          if (response.msg !== null && response.msg !== undefined) {
            idPartida = response.msg;
          }
          const ruta = '/esperar_sala/' + idPartida;
          this.router.navigateByUrl(ruta);
        } else{
          console.log('Error al crear la sala');
          reject(false);
        }
      });
    });
  }

  public unirseSalaEsperar(user: any): Promise<string> {
    console.log("UNIRSE SALA ESPERAR", user);
    
    
    return new Promise<string>((resolve, reject) => {
      this.socket.emit('unirJugador', user, (response: any) => {
        
        console.log('unirJugador response:', response);
        console.log('unirJugador response.cod:', response.cod);
        if (response.cod === 0) {
          let idPartida = '';
          idPartida = user.idPartida;
          const ruta = '/esperar_sala/' + idPartida;
          this.router.navigateByUrl(ruta);
          resolve(response.cod);
        }  else {
          console.log('Error al unirse a la sala');
          resolve(response.cod);
        }
      });
    });
  }
  
}